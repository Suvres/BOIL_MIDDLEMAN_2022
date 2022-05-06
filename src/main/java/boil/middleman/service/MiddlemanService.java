package boil.middleman.service;

import boil.middleman.entity.Middleman;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class MiddlemanService {

    public Middleman countMiddleman(Middleman middleman){

        float[][][] gainTable = initTable(middleman);

        gainTable = findMaxElements(middleman, gainTable);

        gainTable = optimiseTable(gainTable);

        printTable(gainTable);

        return null;

    }

    private float[][][] initTable(Middleman middleman){

        float[][][] table = new float[middleman.getUnitPrice().length][][];

        for(int i=0; i< table.length;i++){

            table[i]=new float[middleman.getUnitPrice()[i].length][];

        }

        for(int i=0;i< table.length;i++){

            for(int j=0;j<table[i].length;j++){

                table[i][j] = new float[2];

                if(i<table.length-1 && j<table[i].length-1)
                    table[i][j][0] = middleman.getPrice()[j] - middleman.getUnitPrice()[i][j] - middleman.getCost()[i];

            }

        }

        return table;
    }

    private float[][][] findMaxElements(Middleman middleman, float[][][] gainTable){

        boolean isDone = true;

        for(int i=0; i<middleman.getDemand().length;i++) {
            if (middleman.getDemand()[i] != 0) {
                isDone=false;
            }
        }
        for(int i=0; i<middleman.getSupply().length;i++){
            if(middleman.getSupply()[i] != 0)
                isDone=false;
        }

        if(isDone)
            return gainTable;

        float maxElement = 0;

        for(int i=0; i<gainTable.length;i++) {
            for (int j = 0; j < gainTable[i].length; j++) {
                if(gainTable[i][j][0] < maxElement)
                    maxElement = gainTable[i][j][0];
            }
        }

        int maxI = 0;
        int maxJ = 0;

        for(int i=0; i<gainTable.length;i++){
            for(int j=0; j<gainTable[i].length; j++){

                if(gainTable[i][j][0] >= maxElement && middleman.getDemand()[j] > 0 && middleman.getSupply()[i] > 0){
                    maxElement = gainTable[i][j][0];
                    maxI=i;
                    maxJ=j;

                }

            }
        }

        if(middleman.getSupply()[maxI] > middleman.getDemand()[maxJ]){

            middleman.getSupply()[maxI] -= middleman.getDemand()[maxJ];
            gainTable[maxI][maxJ][1] = middleman.getDemand()[maxJ];
            middleman.getDemand()[maxJ] = 0;

        }
        else {
            middleman.getDemand()[maxJ] -= middleman.getSupply()[maxI];
            gainTable[maxI][maxJ][1] = middleman.getSupply()[maxI];
            middleman.getSupply()[maxI] = 0;
        }


        return findMaxElements(middleman,gainTable);
    }

    private void printTable(float[][][] gainTable){

        for(int i=0; i< gainTable.length;i++){

            for(int j=0;j<gainTable[i].length; j++){

                System.out.print(Arrays.toString(gainTable[i][j]) +" ");

            }

            System.out.print("\n");

        }

    }

    private float[][][] optimiseTable(float[][][] gainTable){

        float[] alpha = new float[gainTable.length];
        float[] beta = new float[gainTable[0].length];

        for(int i=1; i<alpha.length; i++)
            alpha[i] = Float.NaN;

        for(int i=0; i< beta.length;i++)
            beta[i] = Float.NaN;

        findAlphaAndBeta(alpha,beta,gainTable);

        for(int i=0; i<alpha.length; i++){

            for(int j=0; j<beta.length; j++){

                if(gainTable[i][j][0] - alpha[i] - beta[j] > 0){

                    gainTable = doTheLoop(i,j,gainTable);

                }

            }
        }

        return gainTable;

    }

    private void findAlphaAndBeta(float[] alpha, float[] beta, float[][][] gainTable){

        boolean isDone = true;

        for(int i=0; i<alpha.length; i++){
            if(Float.isNaN(alpha[i]))
                isDone = false;
        }

        for(int i=0; i< beta.length; i++){
            if(Float.isNaN(beta[i]))
                isDone=false;
        }

        if(isDone)
            return;

        for(int i=0; i<alpha.length; i++){

            for(int j=0; j<beta.length; j++){

                if(gainTable[i][j][1] > 0){

                    if(Float.isNaN(beta[j]) && !Float.isNaN(alpha[i])){

                        beta[j] = gainTable[i][j][0] - alpha[i];

                    }
                    else if(!Float.isNaN(beta[j]) && Float.isNaN(alpha[i])) {
                        alpha[i] = gainTable[i][j][0] - beta[j];
                    }
                }

            }
        }

        findAlphaAndBeta(alpha,beta,gainTable);

    }

    private float[][][] doTheLoop(int selectedI, int selectedJ, float[][][] gainTable){

        List<int[]> indexes = new ArrayList<>();
        int[][] finishedIndexes = new int[4][2];
        finishedIndexes[0][0] = selectedI;
        finishedIndexes[0][1] = selectedJ;

        for(int i=0; i<gainTable.length;i++){

            for(int j=0; j<gainTable[i].length;j++){

                if(gainTable[i][j][1] > 0 &&(i == selectedI || j==selectedJ)){
                    indexes.add(new int[]{i,j});
                }

            }
        }

        boolean isDone=false;
        for(int[] first : indexes){

            for(int[] second : indexes){

                if(first == second)
                    continue;

                for(int i=0; i< gainTable.length && !isDone;i++){

                    for(int j=0; j<gainTable[i].length && !isDone;j++){

                        if(gainTable[i][j][0] > 0){

                            if((first[0] == i && second[1] == j) || (first[1] == j && second[0] == i)){
                                finishedIndexes[1] = first;
                                finishedIndexes[2] = new int[]{i,j};
                                finishedIndexes[3] = second;
                                isDone = true;
                            }

                        }
                    }
                }

                if(isDone)
                    break;

            }
            if(isDone)
                break;
        }

        float minNumber = gainTable[finishedIndexes[1][0]][finishedIndexes[1][1]][1];
        for(int i=2; i<4;i++){
            if(gainTable[finishedIndexes[i][0]][finishedIndexes[i][1]][1] < minNumber)
                minNumber = gainTable[finishedIndexes[i][0]][finishedIndexes[i][1]][1];
        }

        for(int i=0; i<4; i++){

            if(i%2==0){
                gainTable[finishedIndexes[i][0]][finishedIndexes[i][1]][1] += minNumber;
            }
            else
                gainTable[finishedIndexes[i][0]][finishedIndexes[i][1]][1] -= minNumber;

        }

        return optimiseTable(gainTable);

    }

}

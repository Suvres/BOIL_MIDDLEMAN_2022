package boil.middleman.entity;

public class Middleman {
    private float[][] unitPrice;
    // popyt
    private float[] demand;
    // podaż
    private float[] supply;
    private float[] price;
    private float[] cost;

    public float[][] getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(float[][] unitPrice) {
        this.unitPrice = unitPrice;
    }

    public float[] getDemand() {
        return demand;
    }

    public void setDemand(float[] demand) {
        this.demand = demand;
    }

    public float[] getSupply() {
        return supply;
    }

    public void setSupply(float[] supply) {
        this.supply = supply;
    }

    public float[] getPrice() {
        return price;
    }

    public void setPrice(float[] price) {
        this.price = price;
    }

    public float[] getCost() {
        return cost;
    }

    public void setCost(float[] cost) {
        this.cost = cost;
    }
}

package boil.middleman.controller;

import boil.middleman.entity.Middleman;
import boil.middleman.service.MiddlemanService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class DefaultRestController {

    @Autowired
    MiddlemanService middlemanService;

    @PostMapping(value = "/calculate", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity nodeListPost(@RequestBody Middleman middleman) {

        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);

        String json;
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add("Content-Type", "application/json");

        System.out.println(middleman);

        middlemanService.countMiddleman(middleman);

        // TODO Tu nowe dane na zwrot

//        try {
//            json = mapper.writeValueAsString(n);
//        } catch (JsonProcessingException e) {
//
//            return new ResponseEntity("[]", responseHeaders, HttpStatus.BAD_REQUEST);
//        }
        return new ResponseEntity("[]", responseHeaders, HttpStatus.OK);

//        return new ResponseEntity(json, responseHeaders, HttpStatus.OK);
    }
}

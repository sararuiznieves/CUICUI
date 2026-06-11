package com.example.cuicui.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FileUploadRequest {

    private String fileName;
    private String fileContent;

}

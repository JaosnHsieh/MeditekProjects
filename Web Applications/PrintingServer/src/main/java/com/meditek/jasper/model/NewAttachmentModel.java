/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.model;

import java.util.List;

/**
 *
 * @author rockmanexe1994
 */
public class NewAttachmentModel {
    String type;
    String content;
    String name;
    String extension;
    NewRequestDataModel fixedFormData;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getExtension() {
        return extension==null || extension.equals("")?"pdf":extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public NewRequestDataModel getFixedFormData() {
        return fixedFormData;
    }

    public void setFixedFormData(NewRequestDataModel fixedFormData) {
        this.fixedFormData = fixedFormData;
    }

    
    

    
    
    
    
}

package com.stok_team.TheraProgress.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
public class Child {
    @Id
    @Column(name = "id")
    @GeneratedValue(generator = "UUID")
    private UUID id;
    @Column(name = "firstName")
    private String firstName;
    @Column(name = "lastName")
    private String lastName;
    @Column(name = "secondName")
    private String secondName;
    @Column(name = "birth")
    @JsonFormat(pattern = "dd.MM.yyyy")
    private Date birth;
    @Column(name = "target")
    private String target;


    @Column(name = "method")
    private String method;
    @Column(name = "prompt")
    private String prompt;
    @OneToMany(mappedBy = "child")
    @JsonIgnore
    private List<Session> sessions;

    public Child() {
    }

    public Child(String firstName, String lastName, String secondName, Date birth, String method, String prompt) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.secondName = secondName;
        this.birth = birth;
        this.method = method;
        this.prompt = prompt;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getSecondName() {
        return secondName;
    }

    public void setSecondName(String secondName) {
        this.secondName = secondName;
    }

    public Date getBirth() {
        return birth;
    }

    public void setBirth(Date birth) {
        this.birth = birth;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public void getSessions(List<Session> sessions) {
        this.sessions = sessions;
    }
}

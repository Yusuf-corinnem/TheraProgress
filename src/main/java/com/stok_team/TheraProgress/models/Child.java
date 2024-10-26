package com.stok_team.TheraProgress.models;

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
    private Date birth;
    @Column(name = "methodView")
    private String methodView;
    @Column(name = "promptView")
    private String promptView;
    @OneToMany(mappedBy = "child")
    private List<Session> sessions;

    public Child() {
    }

    public Child(String firstName, String lastName, String secondName, Date birth, String methodView, String promptView) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.secondName = secondName;
        this.birth = birth;
        this.methodView = methodView;
        this.promptView = promptView;
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

    public String getMethodView() {
        return methodView;
    }

    public void setMethodView(String methodView) {
        this.methodView = methodView;
    }

    public String getPromptView() {
        return promptView;
    }

    public void setPromptView(String promptView) {
        this.promptView = promptView;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public void getSessions(List<Session> sessions) {
        this.sessions = sessions;
    }
}

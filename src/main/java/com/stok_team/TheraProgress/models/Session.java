package com.stok_team.TheraProgress.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.UUID;

@Entity
public class Session {
    /*
    нет реакции - Н,
    самостоятельная реакция - С,
    реакция с подсказкой - +
    */
    @Id
    @Column(name = "id")
    @GeneratedValue(generator = "UUID")
    private UUID id;

    @Column(name = "date")
    @JsonFormat(pattern="dd.MM.yyyy")
    private Date date;

    @Column(name = "session")
    private ArrayList<Character> session;

    @Column(name = "percentSelfReactions")
    private int percentSelfReactions;

    @Column(name = "methodName")
    private String methodName;

    @Column(name = "phaseName")
    private String phaseName;

    @ManyToOne
    @JoinColumn(name = "child_id")
    private Child child;

    @Transient
    private UUID childId; // Добавляем поле для child_id

    public Session(Date date, ArrayList<Character> session) {
        this.date = date;
        this.session = session;
        this.percentSelfReactions = countPercentSelfReactions(session);
    }

    public Session() {
    }

    public Date getDate() {
        return date;
    }

    public UUID getId() {
        return id;
    }

    public ArrayList<Character> getSession() {
        return session;
    }

    public int getPercentSelfReactions() {
        return percentSelfReactions;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public void setSession(ArrayList<Character> session) {
        this.session = session;
    }

    public void setPercentSelfReactions(int percentSelfReactions) {
        this.percentSelfReactions = percentSelfReactions;
    }

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public String getPhaseName() {
        return phaseName;
    }

    public void setPhaseName(String phaseName) {
        this.phaseName = phaseName;
    }

    public Child getChild() {
        return child;
    }

    public void setChild(Child child) {
        this.child = child;
    }

    public UUID getChildId() {
        return childId;
    }

    public void setChildId(UUID childId) {
        this.childId = childId;
    }

    private int countPercentSelfReactions(ArrayList<Character> session) {
        int count = 0;
        for (Character str : session) {
            if (Character.toLowerCase(str) == 'c') {
                count++;
            }
        }

        return count * 100 / session.size();
    }
}
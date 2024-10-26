package com.stok_team.TheraProgress.repositories;

import com.stok_team.TheraProgress.models.Session;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface SessionRepository extends CrudRepository<Session, UUID> {
}

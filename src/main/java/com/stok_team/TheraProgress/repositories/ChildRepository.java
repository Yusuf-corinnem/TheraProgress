package com.stok_team.TheraProgress.repositories;

import com.stok_team.TheraProgress.models.Child;
import com.stok_team.TheraProgress.models.Session;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface ChildRepository extends CrudRepository<Child, UUID> {
}

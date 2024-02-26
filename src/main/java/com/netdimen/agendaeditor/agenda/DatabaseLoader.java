package com.netdimen.agendaeditor.agenda;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final AgendaRepository agendaRepository;

    private final AgendaItemRepository agendaItemRepository;

    @Autowired
    public DatabaseLoader(AgendaRepository agendaRepository, AgendaItemRepository agendaItemRepository) {
        this.agendaRepository = agendaRepository;
        this.agendaItemRepository = agendaItemRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        createAgendaWithItem(1);
        createAgendaWithItem(2);
        createAgendaWithItem(3);
        createAgendaWithItem(4);
        createAgendaWithItem(5);
    }

    private void createAgendaWithItem(int count) {
        Agenda agenda = new Agenda("Agenda " + count);
        AgendaItem item = new AgendaItem(1, "Welcome", "Opening by Mr. Danny Arevalo", "", 15l, false, agenda);
        AgendaItem secondItem = new AgendaItem(2, "Discussion Issues", "Discuss various issues by different departments", "To further understand the cause/effect of recent issues in the organization", 30l, true, agenda);
        agendaRepository.save(agenda);
        agendaItemRepository.save(item);
        agendaItemRepository.save(secondItem);
    }
}

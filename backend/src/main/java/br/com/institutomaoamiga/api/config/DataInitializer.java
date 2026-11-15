package br.com.institutomaoamiga.api.config;


import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import br.com.institutomaoamiga.api.entity.Ponto;
import br.com.institutomaoamiga.api.entity.TipoPonto;
import br.com.institutomaoamiga.api.repository.PontoRepository;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(PontoRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.saveAll(List.of(
                    Ponto.builder().nome("Paróquia Sagrada Família").endereco("Rua 8").bairro("Setor Oeste").horario("Seg a Sex, 8h às 18h").tipo(TipoPonto.DISTRIBUICAO).build(),
                    Ponto.builder().nome("Centro Comunitário Jardim Goiás").endereco("Rua 56").bairro("Jardim Goiás").horario("Seg a Sáb, 8h às 16h").tipo(TipoPonto.DISTRIBUICAO).build(),
                    Ponto.builder().nome("Associação Boa Vontade").endereco("Av. Independência").bairro("Setor Norte Ferroviário").horario("Seg a Sex, 8h às 17h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Paróquia Nossa Senhora de Fátima").endereco("Rua 224").bairro("Setor Leste Universitário").horario("Seg a Sáb, 7h30 às 19h").tipo(TipoPonto.DISTRIBUICAO).build(),
                    Ponto.builder().nome("Instituto Mão Amiga - Sede").endereco("Av. T-9").bairro("Setor Bueno").horario("Seg a Sáb, 8h às 20h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Salão Comunitário Campinas").endereco("Praça Joaquim Lúcio").bairro("Campinas").horario("Ter a Dom, 8h às 18h").tipo(TipoPonto.DISTRIBUICAO).build(),
                    Ponto.builder().nome("Paróquia São João Bosco").endereco("Av. Contorno").bairro("Setor Aeroporto").horario("Seg a Sex, 8h às 17h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Igreja Universos da Solidariedade").endereco("Av. Anhanguera").bairro("Setor Central").horario("Ter a Sáb, 9h às 17h").tipo(TipoPonto.COLETA).build()
                ));
            }
        };
    }
}
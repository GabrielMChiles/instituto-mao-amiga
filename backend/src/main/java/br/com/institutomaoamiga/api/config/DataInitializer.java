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
            if (repository.count() < 25) {
                repository.saveAll(List.of(
                    Ponto.builder().nome("Paróquia Sagrada Família").endereco("Rua 8").bairro("Setor Oeste").horario("Seg a Sex, 8h às 18h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Centro Comunitário Jardim Goiás").endereco("Rua 56").bairro("Jardim Goiás").horario("Seg a Sáb, 8h às 16h").tipo(TipoPonto.DISTRIBUICAO).build(),
                    Ponto.builder().nome("Associação Boa Vontade").endereco("Av. Independência").bairro("Setor Norte Ferroviário").horario("Seg a Sex, 8h às 17h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Paróquia Nossa Senhora de Fátima").endereco("Rua 224").bairro("Setor Leste Universitário").horario("Seg a Sáb, 7h30 às 19h").tipo(TipoPonto.DISTRIBUICAO).build(),
                    Ponto.builder().nome("Instituto Mão Amiga - Sede").endereco("Av. T-9").bairro("Setor Bueno").horario("Seg a Sáb, 8h às 20h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Salão Comunitário Campinas").endereco("Praça Joaquim Lúcio").bairro("Campinas").horario("Ter a Dom, 8h às 18h").tipo(TipoPonto.DISTRIBUICAO).build(),
                    Ponto.builder().nome("Paróquia São João Bosco").endereco("Av. Contorno").bairro("Setor Aeroporto").horario("Seg a Sex, 8h às 17h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Igreja Universos da Solidariedade").endereco("Av. Anhanguera").bairro("Setor Central").horario("Ter a Sáb, 9h às 17h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Paróquia Cristo Rei").endereco("Av. 24 de Outubro").bairro("Campinas").horario("Seg a Sex, 8h às 17h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Centro Espírita Luz e Caridade").endereco("Rua 74").bairro("Setor Central").horario("Seg a Sáb, 13h às 18h").tipo(TipoPonto.DISTRIBUICAO).build(),
                    Ponto.builder().nome("Comunidade Solidária Marista").endereco("Rua 15").bairro("Setor Marista").horario("Seg a Sex, 9h às 17h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Paróquia Nossa Senhora Aparecida").endereco("Av. Perimetral").bairro("Setor Coimbra").horario("Seg a Sáb, 8h às 18h").tipo(TipoPonto.DISTRIBUICAO).build(),
                    Ponto.builder().nome("Ação Social Araguaia").endereco("Rua 4").bairro("Setor Central").horario("Seg a Sex, 8h às 16h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Casa de Apoio São Vicente").endereco("Av. Tocantins").bairro("Setor Central").horario("Seg a Dom, 7h às 19h").tipo(TipoPonto.DISTRIBUICAO).build(),
                    Ponto.builder().nome("Paróquia Santa Teresinha").endereco("Rua 10").bairro("Setor Sul").horario("Seg a Sex, 8h às 17h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Fundação Vida Plena").endereco("Av. Portugal").bairro("Setor Oeste").horario("Seg a Sáb, 8h às 17h").tipo(TipoPonto.DISTRIBUICAO).build(),
                    Ponto.builder().nome("Paróquia Nossa Senhora da Salette").endereco("Rua C-120").bairro("Setor Sudoeste").horario("Seg a Sex, 8h às 18h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Projeto Mãos Dadas").endereco("Av. Milão").bairro("Parque Eldorado").horario("Ter a Sáb, 9h às 16h").tipo(TipoPonto.DISTRIBUICAO).build(),
                    Ponto.builder().nome("Centro Social Bela Vista").endereco("Av. 4ª Radial").bairro("Setor Pedro Ludovico").horario("Seg a Sex, 8h às 17h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Paróquia Assunção de Nossa Senhora").endereco("Av. Mangalô").bairro("Setor Morada do Sol").horario("Seg a Sáb, 8h às 18h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Ação Comunitária Vila Nova").endereco("Rua 210").bairro("Vila Nova").horario("Seg a Sex, 8h às 16h").tipo(TipoPonto.DISTRIBUICAO).build(),
                    Ponto.builder().nome("Igreja Batista Central de Goiânia").endereco("Av. Anhanguera").bairro("Setor Aeroporto").horario("Seg a Dom, 8h às 21h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Paróquia São Paulo Apóstolo").endereco("Rua C-208").bairro("Jardim América").horario("Seg a Sex, 8h às 18h").tipo(TipoPonto.DISTRIBUICAO).build(),
                    Ponto.builder().nome("Centro de Solidariedade Bueno").endereco("Av. T-63").bairro("Setor Bueno").horario("Seg a Sáb, 8h às 17h").tipo(TipoPonto.COLETA).build(),
                    Ponto.builder().nome("Associação Amigos do Bem Goiânia").endereco("Rua 90").bairro("Setor Sul").horario("Seg a Sex, 8h às 17h").tipo(TipoPonto.DISTRIBUICAO).build()
                ));
            }
        };
    }
}
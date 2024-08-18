## RFs (Requisitos funcionais)

- [ ] Dev ser possível se cadastrar
- [ ] Dev ser possível se autenticar
- [ ] Dev ser possível obter o perfil de um usuário logado
- [ ] Deve ser possível buscar usuários pelo nome

## RNs (Regras de negócio)

- [ ] O usuário não deve poder se cadastrar com e-mail duplicado
- [ ] O usuário não pode se cadastrar com telefone duplicado
- [ ] O usuário só deverá editar/excluir itens do qual é dono
- [ ] O usuário pode alterar seu conta para privado ou público
- [ ] O usuário poderá bloquear outros usuários em toda a aplicação
- [ ] O perfil do usuário deve ser visível apenas para os usuários com permissão

## RNFs (Regras não-funcionais)

- [ ] A senha do usuário precisa estar criptografada
- [ ] Os dados da aplicação precisam estar persistidos em banco PostgreSQL
- [ ] Todas listas precisam estar com 20 itens por página
- [ ] O usuário deve ser identificado por um JWT (Json Web Token)

# API de Oauth2.0

Opa pessoal, tudo certo? Estou apresentando para vocês uma **API** que construi com as seguintes arquitetura e princípios: `Oauth2,0`, `clean archtecture`, `clean code` e `TDD`.

Vamos iniciar pelas **rotas**? Vamos lá! *(Após isso vou explicar como criei a API)*

## Oauth2.0

Bom, primeiramente vamos iniciar falando sobre como realizei a montagem da lógica do Oauth2.0 nessa aplicação. Consiste em uma forma de se autenticar com alguma aplicação utilizando o **OpenId**, um pouco mais a frente explico melhor sobre o OpenId.

No Oauth2.0 nós possuimos 2 tokens, o `access-token` e o `refresh-token`, esses tokens são super importantes para construirmos o nosso sistema.

* `access-token`: Ele está associado com o ID do usuário e geralmente é temporário por um curto período de tempo, entretanto, nós podemos utilizar o decode nesse token e obteremos o ID do usuário. Possuindo em mãos o ID do usuário é possível coletar as informações do banco de dados que estão relacionados com esse ID. Então, acabei de explicar para vocês acidentalmente um pouco sobre OpenId.

* `refresh-token`: Já nesse token, que geralmente é salvo no banco de dados relacionado com o ID do usuário de quem o pertence. Mas então, para que serve esse token? Serve para que quando o access-token venha ficar inválido seja possível gerar um novo access-token sem precisar que o usuário tenha que ir para a página de login novamente. Ou seja, em quanto o refresh-token for válido, nós sempre teremos um access-token válido.

* `OpenId`: Só para reforçar sobre o OpenId, vamos a um exemplo, sabe aquele site que você consegue realizar login com sua conta do google por exemplo? Então, esse sistema utiliza do OpenId. A partir do momento em que você realiza o login com sua conta do google, ele vai disponibilizar um access-token para a aplicação, que vai estar associado com o seu id. Tendo isso ele pode pegar informações não sensíveis da sua conta enviando esse token para a API do google, pegando por exemplo seu: nome, foto de perfil, email, telefone, e etc...


Tudo isso que expliquei acima foi o que utilizei para desenvolver o meu sistema Oauth2.0.

## Primeira rota: `sign-up`

Essa rota vai ser a responsável por registrar o usuário, e ela vai te retornar os tokens de acesso do usuário.

***Vamos direto ao exemplo:***

BODY:
```json
{
    "name": "WillianAccount",
    "email": "account123@gmail.com",
    "password": "valid_password"
}
```

output:
```json
{
    "expiresIn": 300,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2MzAxODU1YzQyMmJkY2Y1M2NjMzQ2YTUiLCJzdWIiOiJjbGllbnQiLCJpYXQiOjE2NjEwNDQwNjAsImV4cCI6MTY2MTA0NDM2MH0.CV_vO_lq0TBz3t7fW_9S1nUFDVpNXOV214_jSURpmbE",
    "refreshToken": "2615de11c12c7bcc3d74f9196"
}
```


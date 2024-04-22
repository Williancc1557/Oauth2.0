# API de autenticação com Oauth2.0

Opa pessoal, tudo certo? Estou apresentando para vocês uma **API** que construi com as seguintes arquitetura e princípios: `Oauth2,0`, `clean archtecture`, `clean code` e `TDD`.

Utilizei também o eslint da techmmunity, a comunidade/plataforma de tecnologia para auxiliar a todos da área. link do servidor: https://discord.gg/NMtAJ6whG7

Vamos iniciar pelas **rotas**? Vamos lá! _(Após isso vou explicar como criei a API)_

## Oauth2.0

Bom, primeiramente vamos iniciar falando sobre como realizei a montagem da lógica do Oauth2.0 nessa aplicação. Consiste em uma forma de se autenticar com alguma aplicação utilizando o **OpenId**, um pouco mais a frente explico melhor sobre o OpenId.

No Oauth2.0 nós possuimos 2 tokens, o `access-token` e o `refresh-token`, esses tokens são super importantes para construirmos o nosso sistema.

- `access-token`: Ele está associado com o ID do usuário e geralmente é temporário por um curto período de tempo, entretanto, nós podemos utilizar o decode nesse token e obteremos o ID do usuário. Possuindo em mãos o ID do usuário é possível coletar as informações do banco de dados que estão relacionados com esse ID. Então, acabei de explicar para vocês acidentalmente um pouco sobre OpenId.

- `refresh-token`: Já nesse token, que geralmente é salvo no banco de dados relacionado com o ID do usuário de quem o pertence. Mas então, para que serve esse token? Serve para que quando o access-token venha ficar inválido seja possível gerar um novo access-token sem precisar que o usuário tenha que ir para a página de login novamente. Ou seja, em quanto o refresh-token for válido, nós sempre teremos um access-token válido.

- `OpenId`: Só para reforçar sobre o OpenId, vamos a um exemplo, sabe aquele site que você consegue realizar login com sua conta do google por exemplo? Então, esse sistema utiliza do OpenId. A partir do momento em que você realiza o login com sua conta do google, ele vai disponibilizar um access-token para a aplicação, que vai estar associado com o seu id. Tendo isso ele pode pegar informações não sensíveis da sua conta enviando esse token para a API do google, pegando por exemplo seu: nome, foto de perfil, email, telefone, e etc...

Tudo isso que expliquei acima foi o que utilizei para desenvolver o meu sistema Oauth2.0.

## `/api/auth/sign-up` **(POST)**

Essa rota vai ser a responsável por registrar o usuário, e ela vai te retornar os tokens de acesso do usuário. Observe o exemplo abaixo:

**BODY:**

```json
{
  "name": "WillianAccount",
  "email": "account123@gmail.com",
  "password": "valid_password"
}
```

**Saida:**

```json
{
  "expiresIn": 300,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2MzAxODU1YzQyMmJkY2Y1M2NjMzQ2YTUiLCJzdWIiOiJjbGllbnQiLCJpYXQiOjE2NjEwNDQwNjAsImV4cCI6MTY2MTA0NDM2MH0.CV_vO_lq0TBz3t7fW_9S1nUFDVpNXOV214_jSURpmbE",
  "refreshToken": "2615de11c12c7bcc3d74f9196"
}
```

## `/api/auth/sign-in` **(POST)**

Já essa rota vai servir para quando o usuário não tiver mais o refresh-token válido, você direciona-lo para a tela de login. Retornando e atualizando o seu refresh-token.

Por exemplo:

**BODY:**

```json
{
  "email": "teste123@gmail.com",
  "password": "Teste123"
}
```

**Saida:**

```json
{
  "refreshToken": "sb9910f04e2cbafa604a69e1b"
}
```

Mas ai você se pergunta: "Cadê o access-token???". Calma, tendo o refresh-token você pode solicitar o access-token utilizando a próxima rota que vou falar abaixo, observe.

## `/api/auth/refresh-token` **(GET)**

Então, temos o nosso refresh-token, e não possuimos o access-token, ou ele está inválido. Para isso temos essa rota, onde você vai solicitar um novo access-token enviando pelo header o seu refresh-token. Veja o exemplo abaixo:

**HEADER:**

```json
"refreshtoken": "ba9910f04e2cbafa604a69e1b"
```

**Saida:**

```json
{
  "expiresIn": 300,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2MmY4NWE4M2IwMDY0YzExODk0M2JlNzYiLCJzdWIiOiJjbGllbnQiLCJpYXQiOjE2NjExMTU5MzAsImV4cCI6MTY2MTExNjIzMH0.HeKmXNam6ds0X_xKskPtbjF68JHeod9TRrA9s_9kWms"
}
```

Você deve estar se perguntando para que serve esse expireIn retornado pela API, ela é o tempo em segundos que esse accessToken vai ser expirado.

## `/api/auth/token-info` **(GET)**

Para pegar as informações do access-token, essa rota é a ideal! Para isso passe o seu access-token utilizando o header. Observe o exemplo abaixo:

**HEADER:**

```json
{
  "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2MmY4NWE4M2IwMDY0YzExODk0M2JlNzYiLCJzdWIiOiJjbGllbnQiLCJpYXQiOjE2NjA0NDM3MjQsImV4cCI6MTY2MDQ0NDAyNH0.aENfxONnDKOqquMuSMpGTLvnX-T1vcGr5tXclrQfilE"
}
```

**Saida:**

```json
{
  "accountId": "62f85a83b0064c118943be76",
  "sub": "client",
  "iat": 1661116870,
  "exp": 1661117170
}
```

- `accountId`: É o id do usuário;
- `sub`: A quem pertence esse token;
- `iat`: Serve para visualizar em que tempo o token foi criado;
- `exp`: Serve para visualizar quando que o token vai ser expirado.

## `/api/auth/check-token` (GET)

This router will be important because when we have a middleware in other application we need to verify if the token is valid. Because this I created this router to keep the responsibility of the token in this api.

Just put the token in the header as in the example below:

**HEADER:**

```json
"authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2MmY4NWE4M2IwMDY0YzExODk0M2JlNzYiLCJzdWIiOiJjbGllbnQiLCJpYXQiOjE2NjA0NDM3MjQsImV4cCI6MTY2MDQ0NDAyNH0.aENfxONnDKOqquMuSMpGTLvnX-T1vcGr5tXclrQfilE"
```

**OUTPUT:**

```json
true or false
```

## Variáveis de ambiente

Aqui eu irei falar as variáveis de ambiente que você pode utilizar para dados que podem ser sensíveis. Não se preocupe, não é obrigatório essas variáveis, pois a API já possuem as variáveis por padrão.

Para poder setar as variáveis crie um arquivo com o nome `.env` fora do `src`, vou demonstrar uma variável abaixo por exemplo:

```env
    MONGO_URL=http://example.com
    PORT=1234
    SECRET_JWT=mysecretjwt
```

[Clicando aqui](https://github.com/Williancc1557/Oauth2.0/blob/master/src/main/config/env.ts) você vai ver as variáveis default (padrão).

### Variáveis:

- `MONGO_URL`: Serve para você setar o url do seu mongodb caso exista, caso não ele vai criar um automaticamente na sua máquina. Para isso baixe o mongodb no seu computador.

- `PORT`: A porta que a API vai utilizar

- `SECRET_JWT`: O secret que a API vai utilizar para criar o access-token

## Testes com jest

Nessa aplicação deixei o máximo coberto de testes possível, para que seja possível realizar mudanças sem se preocupar em que algo tenha sido mudado, realizado alguma mudança inesperada. Para isso utilizei o `jest`, ótima ferramenta para testar partes de código, como essa aplicação é feita a partir do clean archtecture, então existem lugares que contém dependências. Para conseguir testar algo que exige dependências utilizamos o sistema de mockar do jest.

Para mockar, o jest lhe proporciona algumas ferramentas, entre elas, existe o spyOn, que foi o que utilizei para mockar nessa API. E também utilizei os stubs, que são tipo umas dependências falsas, e nessas dependências falsas, é possível dar os parâmetros e o retorno.

Podemos utilizar o spyOn para espionar os métodos desses stubs, ou seja, ver a quantidade de vezes que esse método do stub foi chamado, o que entro de parâmetro nesse método, ou até mesmo setar o retorno desse método, e entre mais funcionalidades. Com isso você consegue testar todas as depêndencias, olhando o que entra nela como parâmetro, para onde ela está indo, retorno, se ela dar erro para onde ela vai, e etc. Observe o exemplo de teste a seguir:

```ts
/**
 * Vamos criar essa classe que recebe uma dependência que pelo nome vai
 * fazer algum parágrafo para utilizarmos.
 * */
class TestDependency {
  public constructor(private readonly makeParagraph: MakeParagraph) {}
  public paragraph(name: string): string {
    const paragraph = this.makeParagraph.make(name);

    return paragraph;
  }
}

/* teste-dependency.spec.ts (arquivo para testar a classe acima) */

test("should Teste.paragraph is called with valid param", () => {
  // Aqui eu criei o stub (fake dependência)
  class makeParagraphStub {
    public make(name: string): string {
      return `hello ${name}`;
    }
  }

  // aqui eu passei o nosso stub como uma fake dependência
  const sut = new TestDependency(makeParagraphStub);

  // aqui eu pego a dependência espionada para utiliza-la depois
  const makeParagraphSpy = jest.spyOn(makeParagraphStub);

  // aqui eu executo a nossa classe
  sut.paragraph("willian");

  // aqui eu verifico se a dependência foi chamada com o parâmetro correto
  expect(makeParagraphSpy).toHaveBeenCalledWith("willian");
});
```

E foi assim que fui testando cada classe dessa API.

### Comandos

- `yarn test`: Esse comando irá executar todos os testes, mas não irá amostrar as logs;

- `yarn test:unit`: Esse comando irá executar todos os testes unitários com o `.spec.ts` no nome do arquivo e não vai amostrar as logs também;

- `yarn test:integration`: Esse comando irá executar todos os testes de integração com o `.test.ts` no nome do arquivo e não vai amostrar as logs também;

- `yarn test:verbose`: Esse comando irá executar todos os testes, mas diferente do `yarn test`, esse vai mostrar todas as logs;

- `yarn test:ci`: Esse comando irá executar todos os testes e vai criar o coverage, que é o arquivo que gera um html mostrando os arquivos que estão cobertos com testes.

## Camadas do sistema

É possível visualizar dentro do `src` as camadas dessa API, vou listar elas aqui e explicar qual a função de cada uma.

- `data`: Aqui é a camada em que vai ter as dependências que vão se comunicar com o infra, onde fica a infraestrutura da aplicação;

- `decorators`: Camada no qual tem alguns design patterns que utilizo ao longo da API;

- `domain`: É o core dessa API onde fica as principais interfaces utilizadas na aplicação;

- `infra`: Serve para se comunicar com o banco de dados e pegar dados e enviar dados;

- `main`: Aqui serve para integrar a API com algum framework como o express utilizado nessa API;

- `presentation`: Já nessa camada crio os controllers e as suas dependências em formato de interface;

- `utils`: Nessa camada, coloco classes, métodos, ou outra coisas que sei que serão utilizados constatemente ao longo da API.

E foi assim que fui montando cada rota dessa API, utilizando essas camadas listadas acima.

## Lefthook

Essa tecnologia utilizei para evitar mandar commits com algum teste falhando. Como ela funciona? Nele eu posso setar algum comando para ser executado quando alguém da o comando do commit ele vai executar esse tal comando. Se esse comando der erro, o commit vai falhar. Se eu colocar por exemplo o comando `yarn test` no lefthook ele vai executar o comando para realizar todos os tests antes de commitar algo, se caso algum teste falhar, o commit não será realizado.

A configuração do lefthook está localizada no arquivo `.lefthook.yml`.

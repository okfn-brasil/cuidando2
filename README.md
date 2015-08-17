# Cuidando do Meu Bairro 2.0

**Projeto ainda em desenvolvimento!**

Este projeto se trata de uma reescrita do [Cuidando do Meu Bairro](http://cuidando.org.br), que busca mapear a execução do orçamento municipal de São Paulo, não só em regiões, mas também colocando um ponto no mapa para cada despesa.

Como os [dados que pegamos da prefeitura](http://orcamento.prefeitura.sp.gov.br/orcamento/execucao.html) não têm as latitudes e longitudes de cada despesa (no máximo algumas tem a região a que se destinam), tentamos mapeá-las procurando automaticamente por endereços nos textos das descrições dessas despesas.
Para isso usamos [*expressões regulares*](https://pt.wikipedia.org/wiki/Express%C3%A3o_regular).
Uma vez extraídos esses endereços usamos serviços como [Open Street Maps](http://www.openstreetmap.org) ou Google Maps para obter suas latitudes e longitudes e então, finalmente, colocá-los em um mapa.
Porém, esse processo não é perfeito, e muitas despesas não são mapeadas, ou acabam exibidas no local errado...

Nessa segunda versão do Cuidando, pretendemos melhorar aquilo que o ele já fazia e adicionar novas funcionalidades.


## Arquitetura

Abaixo estão representados os diversos módulos nos quais esse projeto se baseia:

![Alt text](https://rawgit.com/okfn-brasil/cuidando2/master/doc/images/cuidando2_arq2.svg)

Linkando para os respectivos repositórios:

- [Gastos Abertos](https://github.com/okfn-brasil/gastos_abertos): Geolocalização e fornecimento dos dados de execução orçamentária. ([endpoint](http://demo.gastosabertos.org))
- [Vira-Lata](https://github.com/okfn-brasil/viralata): Autenticação via token (usados para acessar os outros serviços) e informações sobre o usuário. ([endpoint](http://cuidando.org.br:5002))
- [Tagarela](https://github.com/okfn-brasil/tagarela): Comentários. ([endpoint](http://cuidando.org.br:5002))
- [EsicLivre](https://github.com/okfn-brasil/esiclivre): Interface com eSIC para a realização de pedidos de informação. ([endpoint](http://cuidando.org.br:5004) - ainda não online)


## Instalando

Para instalar todos os repositórios necessários para executar esse projeto, há um shell script "guia" [aqui](doc/install.sh).

Caso só queira instalar esse repositório, clone-o e rode dentro dele:

```
$ python setup.py develop
```

Depois configure um `settings/local_settings.py`.


## Rodando

Para rodar o site:

```
$ python site.py
```

Depois acesse `localhost:5001` em um navegador.

Como o esse projeto depende de vários micro serviços, sugiro que você tenha um script para rodar todos eles quando quiser. Há um exemplo [aqui](doc/run.py).


## Compilando

Para compilar o site para produção, rode:

```
$ python site.py build
```

Caso queira usar um arquivo de configuração diferente do `local_settings.py`, por exemplo um `prod_settings.py` use:

```
$ python site.py build prod
```

O site compilado (estático, com JS minificado etc) deverá estar na pasta `build`.
Você pode testá-lo entrando na pasta, servindo-o com o comando a seguir e abrindo o endereço em um navegador:

```
$ python -m http.server
```

Caso algo saia errado, tente remover os arquivos de build e tentar novamente:

```
$ rm -rf build static/build static/.webassets-cache
```


### Limitadores de versão do browser:

- [localStorage](http://caniuse.com/#feat=namevalue-storage): IE8+
- [history](http://caniuse.com/#feat=history): IE10+ (suporte manual minimamente implementado)

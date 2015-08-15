# Cuidando do Meu Bairro 2.0

**Projeto ainda está em desenvolvimento!**

Este projeto se trata de uma reescrita do [Cuidando do Meu Bairro](http://cuidando.org.br), que busca mapear a execução do orçamento municipal de São Paulo, não só em regiões, mas também colocando um ponto no mapa para cada despesa.

Como os [dados que pegamos da prefeitura](http://orcamento.prefeitura.sp.gov.br/orcamento/execucao.html) não tem as latitudes e longitudes de cada despesa (no máximo algumas tem a região a que se destinam), tentamos mapeá-las procurando automaticamente por endereços nos textos das descrições dessas despesas.
Para isso usamos [*expressões regulares*](https://pt.wikipedia.org/wiki/Express%C3%A3o_regular).
Uma vez extraídos esses endereços usamos serviços como [Open Street Maps](http://www.openstreetmap.org) ou Google Maps para obter suas latitudes e longitudes e então, finalmente, colocá-los em um mapa.
Porém, esse processo não é perfeito, e muitas despesas não são mapeadas, ou acabam exibidas no local errado...

Nessa segunda versão do Cuidando, pretendemos melhorar aquilo que o ele já fazia e adicionar novas funcionalidades.


## Arquitetura

Abaixo estão representados os diversos módulos nos quais esse projeto se baseia:

![Alt text](https://rawgit.com/okfn-brasil/cuidando2/master/doc/images/cuidando2_arq2.svg)

Linkando para os respectivos repositórios:

- [Gastos Abertos](https://github.com/okfn-brasil/gastos_abertos): Geolocalização e fornecimento dos dados de execução orçamentária.
- [Viralata](https://github.com/okfn-brasil/viralata): Autenticação.
- [Tagarela](https://github.com/okfn-brasil/tagarela): Comentários.
- [EsicLivre](https://github.com/okfn-brasil/esiclivre): Interface com eSIC.


## Instalando

```
$ python setup.py install
```

## Rodando

```
$ python site.py
```

### Limitadores de versão do browser:

- [localStorage](http://caniuse.com/#feat=namevalue-storage): IE8+
- [history](http://caniuse.com/#feat=history): IE10+ (suporte manual minimamente implementado)


Para mais informações consulte nossa Wiki, disponível (assim com o repositório) em dois *sabores*: [Wiki GitLab](https://gitlab.com/ok-br/cuidando2/wikis/home) e [Wiki GitHub](https://github.com/okfn-brasil/cuidando2/wiki).

Já para os "*issues*", como ainda não sabemos sincronizá-los entre GitLab e GitHub, favor usar o [*issues* do GitLab](https://gitlab.com/ok-br/cuidando2/issues).

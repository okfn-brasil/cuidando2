from subprocess import Popen


# Esse script tem por objetivo facilitar a execução de todos os micro serviços
# necessários para o sistema Cuidando 2. A ideia é: depois de tudo instalado,
# quando quiser levantar o sistema todo para desenvolvimento, é só executar
# esse script. Ele deve abrir um terminal para cada micro serviço, carregar o
# virtualenv em cada um, e rodar o micro serviço.
# Se tudo der certo, no final é só acessar o site no navegador, por exemplo,
# em: localhost:5001
# Adicione outros comandos que você queira rodar sempre que for carregar seu
# ambiente de desenvolvimento ;)


# Coloque aqui o nome da pasta do virtualenv!
VENV = "env"

# Coloque aqui o nome do terminal que você quer usar!
TERM = "termite"


def cd(directory):
    return ["cd " + directory]


def rodar(args):
    # Caso você não use o ZSH, troque e adapte esse comando!
    cmd = [TERM, "-e", "/usr/bin/zsh -is eval '%s'" % ';'.join(args)]
    Popen(cmd)


# -------------- Cuidando ------------ #

# Altere BASE_CUIDANDO! Ele deve apontar para uma pasta contendo algo como
# isso:
#
# cuidando
# ├── env       (virtualenv para todos os micro serviços)
# ├── cuidando2 (repositório do site)
# ├── esiclivre
# ├── tagarela
# └── viralata
#
# No exemplo acima a variável abaixo apontaria para a pasta "cuidando"
BASE_CUIDANDO = "/caminho/para/a/pasta/com/os/repositorios/do/cuidando"

# Ativar VENV
ativar = cd(BASE_CUIDANDO) + ["source %s/bin/activate" % VENV]

# Rodar site
caminho_comando = cd("cuidando2") + ["python manage.py run"]
rodar(ativar + caminho_comando)

# Rodar Vira-Lata
caminho_comando = cd("viralata") + ["python manage.py run"]
rodar(ativar + caminho_comando)

# Rodar Tagarela
caminho_comando = cd("tagarela") + ["python manage.py run"]
rodar(ativar + caminho_comando)

# Rodar EsicLivre
caminho_comando = cd("esiclivre") + ["python manage.py run"]
rodar(ativar + caminho_comando)


# Rode algum outro comando que você queira. Ex.: para abrir o gerenciador de
# arquivos "ranger" na pasta do projeto:
# rodar(cd(BASE_CUIDANDO) + ["ranger"])


# -------------- GA -------------- #

# Use esses comandos caso queira rodar o Gastos Abertos localmente (e não usar
# o endpoint online). Você vai precisar instalá-lo e carregar os dados no BD...

# BASE_GA = "/caminho/para/a/pasta/do/GA"
# # Ativar VENV
# ativar = cd(BASE_GA) + ["source %s/bin/activate" % VENV]
# # Rodar servidor
# servidor = cd("gastos_abertos") + ["python manage.py run"]
# rodar(ativar + servidor)

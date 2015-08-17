
# Clonar tudo
git clone git@github.com:okfn-brasil/viralata.git
git clone git@github.com:okfn-brasil/tagarela.git
git clone git@github.com:okfn-brasil/cuidando2.git
git clone git@github.com:okfn-brasil/viratoken.git
git clone git@github.com:okfn-brasil/esiclivre.git

# Criar virtualenv (não esqueça de escolher o virtualenv 2 ou 3 de acordo com o
# Python que quiser usar)
virtualenv env
. env/bin/activate

# Se for usar Postgres:
# pip install psycopg2
#
# Abra um terminal postgres e crie uma base para cada micro serviço (viralata,
# tagarela, esiclivre). O comando poderia ser semelhante a esse para cada um:
# CREATE USER <usuario> WITH PASSWORD '<senha>';
# CREATE DATABASE <base> OWNER <usuario>;

# Configure cada micro serviço e o cuidando2. Para isso entre pasta settings de
# cada um e crie um arquivo local_settings.py baseado no
# local_settings.example.py

# Instale as dependências Python.
# É importante instalar nessa ordem para usar as versões do ViraToken
# e do Vira-Lata do repositório clonado, e não do PyPi.
cd viratoken
python setup.py develop

cd ../viralata
python setup.py develop
python manage.py initdb

cd ../tagarela
python setup.py develop
python manage.py initdb

cd ../esiclivre
python setup.py develop
python manage.py initdb

cd ../cuidando2
python setup.py develop

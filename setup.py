#!/usr/bin/env python
# coding: utf-8

from setuptools import setup

setup(
    name="cuidando2",
    version='0.1',
    description='Cliente para o sistema Cuidando do Meu Bairro 2.0.',
    author='Andrés M. R. Martano',
    author_email='andres@inventati.org',
    url='https://gitlab.com/ok-br/esiclivre',
    packages=["cuidando2"],
    install_requires=[
        'Flask',
        'Frozen-Flask',
        'Flask-Assets',
        'Flask-Script',
    ],
    keywords=['budget'],
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Environment :: Web Environment",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: GNU Affero General Public License v3 or later (AGPLv3+)",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
        "Programming Language :: Python :: 2",
        "Programming Language :: Python :: 3",
        "Environment :: Web Environment",
        "Topic :: Internet :: WWW/HTTP",
    ]
)

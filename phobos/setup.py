#!/usr/bin/env python
# coding: utf-8

from setuptools import setup

setup(
    name="phobos",
    version='0.0.1',
    # url='',
    description='Small lib to encode and decode JWTs',
    author='Andrés M. R. Martano',
    # author_email='',
    packages=["phobos"],
    install_requires=[
        'cryptography',
        'pyjwt',
    ],
    # classifiers=[
    # ]
)

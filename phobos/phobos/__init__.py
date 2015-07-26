#!/usr/bin/env python
# coding: utf-8

import jwt
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from cryptography.hazmat.backends import default_backend
# from cryptography.x509 import load_pem_x509_certificate

# from itsdangerous import Signer
# from itsdangerous import JSONWebSignatureSerializer
# signer = JSONWebSignatureSerializer(DANGEROUS_SECRET_KEY)

# a=jwt.encode({"username":u, 'exp': datetime.utcnow()}, D)

# openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout privateKey.key -out certificate.crt
# cert_obj = load_pem_x509_certificate(cert_str, default_backend())
# cert_obj.public_key()
# serialization.load_ssh_public_key(r, d)


class SignerVerifier(object):
    """Class to encode and decode JWTs."""

    def __init__(self,
                 priv_key_path=None,
                 priv_key_password=None,
                 pub_key_path=None,
                 algorithm='RS512'):
        self.algorithm = algorithm
        if priv_key_path:
            self.load_priv_key(priv_key_path, priv_key_password)
        if pub_key_path:
            self.load_pub_key(pub_key_path)

    def load_priv_key(self, path, priv_key_password=None):
        """Loads private and public key from a private key PEM file."""
        with open(path, "rb") as key_file:
            self.priv_key = load_pem_private_key(key_file.read(),
                                                 priv_key_password,
                                                 default_backend())
            self.pub_key = self.priv_key.public_key()

    def load_pub_key(self, path):
        """Loads public key from a public key SSH file."""
        with open(path, "r") as key_file:
            self.pub_key = key_file.read()

    def encode(self, data, exp=None):
        """Encodes data. If has 'exp', sets expiration to it."""
        if self.priv_key:
            if exp:
                data["exp"] = exp
            return jwt.encode(
                data,
                self.priv_key,
                algorithm=self.algorithm
            ).decode("utf8")
        else:
            raise "Error: No private key!"

    def decode(self, data):
        """Decodes data."""
        if self.pub_key:
            return jwt.decode(data, self.pub_key)
        else:
            raise "Error: No public key!"

-include .env

all : install build

build :; @forge build

install:
	@forge install selfxyz/self --no-commit
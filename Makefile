-include .env

all : install build

build :; @forge build

install:
	@forge install selfxyz/self --no-commit && forge install hyperlane-xyz/hyperlane-monorepo@bdccf29ee387dc671c3b42383cb5cdf1bd6689f3 --no-commit
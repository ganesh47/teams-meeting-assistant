install:
	npm ci

build:
	npm run build

test:
	npm test

check:
	bash scripts/check-artifacts.sh

smoke-linux-cli:
	node dist/cli.js

docker-build:
	docker build -t teams-meeting-assistant:local .

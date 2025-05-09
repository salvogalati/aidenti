PROJECT_NAME = analyst-agent
CWD := $(shell pwd)

ifeq (,$(shell which conda))
HAS_CONDA=False
else
HAS_CONDA=True
endif
MICROMAMBA = /home/user/micromamba-bin/micromamba
MICROMAMBA_DOCKER = /opt/conda/bin/mamba
CONDA_BASE = $(shell $(MICROMAMBA) info --json | jq -r '.["base environment"]')

CONDA_ACTIVATE = micromamba activate $(PROJECT_NAME)

AIGOT_AGE_PUBLIC_KEY_DEV = age164x5ezs2x20q9w0r8ptvngczf2scm5nm9m3gawy8uuqsrqmuf4jsr8jphg
AIGOT_AGE_PUBLIC_KEY_STG = age1nuu0adam0xch0mmm309kjla7vw9hlt38alkuqwt33f4kv8f72amq2wwj9w

FILES_TO_ENCRYPT = .env
# Default target
all: create_environment

# Create conda environment
create_environment:
	@echo ">>> Creating conda environment $(PROJECT_NAME)..."
	$(MICROMAMBA) env create --name $(PROJECT_NAME) -f ./src/environment.yaml -y
	@echo ">>> Environment created. Activate with: micromamba activate $(PROJECT_NAME)"

# Update conda environment
update_environment:
	@echo ">>> Updating conda environment $(PROJECT_NAME)..."
	$(MICROMAMBA) run --name $(PROJECT_NAME) conda env update --name $(PROJECT_NAME) -f ./src/environment.yaml --prune
	@echo ">>> Environment updated."

# Delete conda environment
delete_environment:
	@echo ">>> Deleting conda environment $(PROJECT_NAME)..."
	$(MICROMAMBA) deactivate && $(MICROMAMBA) remove --name $(PROJECT_NAME) --all -y
	@echo ">>> Environment deleted."

create_environment_docker: ## create conda environment
	@echo ">>> Creating Docker conda environment $(PROJECT_NAME)..."
	$(MICROMAMBA_DOCKER) env create --name $(PROJECT_NAME) -f ./environment.yaml -y
	@echo ">>> New conda environment created. Activate with: micromamba activate $(PROJECT_NAME)"


# Format code
fmt:
	black backend && \
	isort --profile black backend

# Lint code
lint:
	ruff check backend  --exclude "*.ipynb" && \
	mypy --explicit-package-bases backend

.PHONY: secrets-encrpyt
## encrypt secrets with SOPS and AGE
secrets-encrpyt:
	echo "Files to encrypt: $(FILES_TO_ENCRYPT)"
	for file in $(FILES_TO_ENCRYPT); do \
		echo "Encrypting: $$file"; \
		sops --encrypt --age $(AIGOT_AGE_PUBLIC_KEY_DEV) --input-type binary --output-type binary $${file} > $${file}-dev.enc; \
	done

.PHONY: secrets-encrpyt-stg
## encrypt secrets with SOPS and AGE
secrets-encrpyt-stg:
	echo "Files to encrypt: $(FILES_TO_ENCRYPT)"
	for file in $(FILES_TO_ENCRYPT); do \
		echo "Encrypting: $$file"; \
		sops --encrypt --age $(AIGOT_AGE_PUBLIC_KEY_STG) --input-type binary --output-type binary $${file} > $${file}-stg.enc; \
	done

.PHONY: secrets-decrypt
## encrypt secrets with SOPS and AGE
secrets-decrypt:
	export SOPS_AGE_KEY_FILE=age-key-dev.txt; \
	for file in $(FILES_TO_ENCRYPT); do \
		echo "Decrypting: $$file"; \
		sops --decrypt --input-type binary --output-type binary $${file}-dev.enc > $${file}; \
	done

.PHONY: secrets-decrypt-stg
## encrypt secrets with SOPS and AGE
secrets-decrypt-stg:
	export SOPS_AGE_KEY_FILE=age-key.txt; \
	for file in $(FILES_TO_ENCRYPT); do \
		echo "Decrypting: $$file"; \
		sops --decrypt --input-type binary --output-type binary $${file}-stg.enc > $${file}; \
	done

TESTS = src/analyst_agent/tests
COV_REPORT = html
.PHONY: test coverage clean

# Start MLflow server
start_mlflow:
	($(CONDA_ACTIVATE); mlflow server --backend-store-uri sqlite:///$(HOME)/mlflow/mlflow.db --default-artifact-root $(HOME)/mlflow/mlruns)

# Run tests
test:
	($(CONDA_ACTIVATE); python -m unittest discover -v)

# Clean up
clean:
	@echo "Cleaning up..."
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete

# Phony targets
.PHONY: all create_environment delete_environment fmt lint secrets-encrypt secrets-decrypt start_mlflow test clean

.PHONY: start-detached
start-detached:
	@docker compose up --build

.PHONY: stop-detached
stop-detached:
	@docker compose down

.PHONY: fmt-docker
fmt-docker:
	@docker compose build -- format
	@docker compose run --rm -- format

.PHONY: lint-docker
lint-docker:
	@docker compose build -- lint
	@docker compose run --rm -- lint
	
docker-clean: ## Remove all Docker images and containers
	@echo "Removing all Docker images and containers..."
	@docker compose down
	@docker compose rm -f
	@docker container prune -f
	@docker image prune -a -f
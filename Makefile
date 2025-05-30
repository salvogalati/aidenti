PROJECT_NAME = aidenti
CWD := $(shell pwd)

PUBLIC_KEY = age1nxz3g8efegfv6l8ey2gpz28sd5z3zc2dgmvdpxzvswhgh47shdeqc7y5du
SOPS_PATH = "C:\Users\sgala\Projects\Utils\sops.exe"

FILES_TO_ENCRYPT = backend/.env .env

# Create conda environment
create_environment:
	@echo ">>> Creating conda environment $(PROJECT_NAME)..."
	conda env create --name $(PROJECT_NAME) -f environment.yaml -y
	@echo ">>> Environment created. Activate with: conda activate $(PROJECT_NAME)"

# Update conda environment
update_environment:
	@echo ">>> Updating conda environment $(PROJECT_NAME)..."
	conda run --name $(PROJECT_NAME) conda env update --name $(PROJECT_NAME) -f environment.yaml --prune
	@echo ">>> Environment updated."

# Delete conda environment
delete_environment:
	@echo ">>> Deleting conda environment $(PROJECT_NAME)..."
	conda deactivate && conda remove --name $(PROJECT_NAME) --all -y
	@echo ">>> Environment deleted."


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
		sops --encrypt --age $(PUBLIC_KEY) --input-type binary --output-type binary $${file} > $${file}.enc; \
	done


.PHONY: secrets-decrypt
## encrypt secrets with SOPS and AGE
secrets-decrypt:
	export SOPS_AGE_KEY_FILE=age-key.txt; \
	for file in $(FILES_TO_ENCRYPT); do \
		echo "Decrypting: $$file"; \
		sops --decrypt --input-type binary --output-type binary $${file}.enc > $${file}; \
	done


# Clean up
clean:
	@echo "Cleaning up..."
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete

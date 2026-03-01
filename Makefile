# Makefile for Customizable AI Chatbot

SHELL := /usr/bin/env bash
SCRIPTS_DIR := scripts

.PHONY: all help setup dev build deploy upsert customize clean

all: help

help:
	@echo "Usage: make <target>"
	@echo
	@echo "Available targets:"
	@echo "  setup      Clone repo, install deps & scaffold .env"
	@echo "  dev        Start Next.js development server"
	@echo "  build      Build production bundle"
	@echo "  test       Run tests (unit, integration, e2e)"
	@echo "  deploy     Deploy to Vercel (production)"
	@echo "  upsert     Upsert documents to Pinecone for RAG"
	@echo "  customize  Interactive config for UI/identity/intention"
	@echo "  clean      Remove backup files (*.bak)"

setup:
	@echo "🔄 Running setup..."
	@$(SCRIPTS_DIR)/setup.sh

dev:
	@echo "🚀 Starting dev server..."
	@$(SCRIPTS_DIR)/dev.sh

test:
	@echo "🧪 Running tests..."
	@$(SCRIPTS_DIR)/test.sh

build:
	@echo "🔨 Building for production..."
	@$(SCRIPTS_DIR)/build.sh

deploy:
	@echo "🌐 Deploying to Vercel..."
	@$(SCRIPTS_DIR)/deploy.sh

upsert:
	@echo "📤 Upserting to Pinecone..."
	@$(SCRIPTS_DIR)/upsert_pinecone.sh

customize:
	@echo "🛠️  Launching interactive customizer..."
	@$(SCRIPTS_DIR)/customize.sh

clean:
	@echo "🧹 Cleaning up backups..."
	@find $(SCRIPTS_DIR) -type f -name '*.bak' -delete

.PHONY: show-runtime-info
show-runtime-info:
	@echo "Node: $$(node --version 2>/dev/null || echo unavailable)"
	@echo "npm: $$(npm --version 2>/dev/null || echo unavailable)"
	@echo "Python: $$(python3 --version 2>/dev/null || python --version 2>/dev/null || echo unavailable)"

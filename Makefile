.PHONY: build watch
default: build

build:
	tsc --strictNullChecks NoriTerm.ts VtConnector.ts

watch:
	tsc --strictNullChecks -w NoriTerm.ts VtConnector.ts
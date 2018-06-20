.PHONY: build watch
default: build

build:
	tsc --strictNullChecks NoriTerm.ts

watch:
	tsc --strictNullChecks -w NoriTerm.ts
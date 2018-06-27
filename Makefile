.PHONY: build watch
default: build

build:
	tsc --strictNullChecks NoriTerm.ts TermController.ts ConsoleController.ts

watch:
	tsc --strictNullChecks -w NoriTerm.ts TermController.ts ConsoleController.ts
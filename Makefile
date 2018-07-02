.PHONY: build watch
default: build

FLAGS = --strictNullChecks --noImplicitAny --noImplicitReturns

build:
	tsc $(FLAGS) NoriTerm.ts TermController.ts ConsoleController.ts

watch:
	tsc $(FLAGS) -w NoriTerm.ts TermController.ts ConsoleController.ts
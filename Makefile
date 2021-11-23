compile:
	bash ./compile.sh

abi: compile
	bash ./generate_abi.sh
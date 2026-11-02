# Study Plan: System Programming: Compilers, Exploitation & OS Fundamentals

Study days are **dated calendar days**, not numbered weeks. Nodes run on
consecutive calendar days in a **3 study + 1 rest rhythm**: three study days,
then one rest day, repeating. Day numbers continue across phase boundaries and
never restart.

## Phase 1: Systems Fundamentals

### Day 1: Tue, Nov 3 — C & Rust Foundations

- [ ] C basics — pointers, arrays, structs, manual memory management
  - Site: [Beej's Guide to C Programming](https://beej.us/guide/bgc/)
- [ ] Build a small multi-file C project with a Makefile and debug it with gdb
  - Site: [Beej's Guide to C Programming](https://beej.us/guide/bgc/)
- [ ] Solve 10 C programming exercises
  - Site: [exercism.io C track](https://exercism.org/tracks/c)

### Day 2: Wed, Nov 4 — Rust Ownership & Tooling

- [ ] Rust fundamentals — ownership, borrowing, lifetimes, error handling
  - Site: [The Rust Programming Language](https://doc.rust-lang.org/stable/book/)
- [ ] Rust tooling — cargo, crates, unsafe blocks, FFI to C
  - Site: [The Rust Programming Language](https://doc.rust-lang.org/stable/book/)
- [ ] Solve 10 Rust exercises
  - Site: [exercism.io Rust track](https://exercism.org/tracks/rust)

### Day 3: Thu, Nov 5 — Build CLI Tools

- [ ] Build a small CLI tool in C (e.g. a hex dump utility or file stats tool)
- [ ] Build the same tool in Rust and compare design approaches
- [ ] Try Linux Kernel Labs day 1 — first lab: explore the kernel source tree
  - Site: [Linux Kernel Labs](https://linux-kernel-labs.github.io/refs/heads/master/)

### Rest Day: Fri, Nov 6 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 4: Sat, Nov 7 — Nand2Tetris & CPU Internals

- [ ] Nand2Tetris Part I — build a CPU from NAND gates: start with the ALU, then the register file, then the RAM
  - Site: [Nand2Tetris](https://www.nand2tetris.org)
- [ ] Dive Into Systems Chapter 1 — how a computer works from hardware to software
  - Site: [Dive Into Systems](https://diveintosystems.org/)

### Day 5: Sun, Nov 8 — Computer Architecture Basics

- [ ] ISA concepts — RISC vs CISC, ARM vs RISC-V instruction sets
  - Book: "Computer Organization and Design RISC-V Edition" by David A. Patterson & John L. Hennessy
  - Site: [Computer Organization and Design RISC-V Edition](https://www.cs.sfu.ca/~ashriram/Courses/CS295/assets/books/HandP_RISCV.pdf)
- [ ] Pipelining — hazards, stalls, instruction-level parallelism
  - Book: "Computer Organization and Design ARM Edition" by David A. Patterson & John L. Hennessy
  - Site: [Computer Organization and Design ARM Edition](http://home.ustc.edu.cn/~louwenqi/reference_books_tools/Computer%20Organization%20and%20Design%20ARM%20edition.pdf)

### Day 6: Mon, Nov 9 — Assembly Foundations

- [ ] x86-64 registers, stack, syscalls — write hello-world in NASM
  - Site: [NASM Tutorial](https://cs.lmu.edu/~ray/notes/nasmtutorial/)
- [ ] x86-64 lessons — arithmetic, control flow, loops
  - Site: [OMU x86_64 lessons](https://omu.rce.so/lessons/asm-x86-64/)
- [ ] Assembler toolchain — assemble, link, inspect with objdump and readelf
  - Site: [ASM Tutor](https://asmtutor.com/)

### Rest Day: Tue, Nov 10 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 7: Wed, Nov 11 — Assembly Practice & Cracking

- [ ] Map C to assembly — compile small C programs and read the disassembly on Compiler Explorer
  - Site: [Compiler Explorer](https://godbolt.org/)
- [ ] Reversing x86 and C for beginners — identify loops, switches, structs in disassembly
  - Site: [Reversing x86 and C for Beginners](https://0x44.cc/reversing/2021/07/21/reversing-x86-and-c-code-for-beginners.html)
- [ ] Solve 3 easy crackmes
  - Site: [crackmes.one](https://crackmes.one)

### Day 8: Thu, Nov 12 — Exploitation Basics

- [ ] Stack layout and buffer overflows — overwrite the return address
  - Site: [pwn.college](https://pwn.college)
- [ ] Shellcode basics — write and run position-independent shellcode
  - Site: [Introduction to Exploit Development](https://samsclass.info/127/ED_2020.shtml)
- [ ] Systems hacking handbook — introduction and tooling setup
  - Site: [ike: Systems Hacking Handbook](https://ike.mahaloz.re/1_introduction/introduction.html)

### Day 9: Fri, Nov 13 — Debugging & Mitigations

- [ ] Debug an overflow with gdb/pwndbg — find offsets, control the instruction pointer
  - Site: [Nightmare](https://guyinatuxedo.github.io/index.html)
- [ ] Mitigations primer — NX, stack canaries, PIE, ASLR
  - Site: [CS6265 Reverse Engineering and Binary Exploitation Lab](https://tc.gts3.org/cs6265/2021/_static/tut.pdf)
- [ ] Solve 3 pwn.college modules on memory errors
  - Site: [pwn.college](https://pwn.college)

### Rest Day: Sat, Nov 14 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 10: Sun, Nov 15 — Compilers: Language Design & Lexing

- [ ] Define a small language — grammar, syntax, semantics
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Scanner — tokens, lexemes, hand-written lexer
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Stanford CS143 — lexing and finite automata notes
  - Site: [Stanford CS143 Compilers](https://web.stanford.edu/class/archive/cs/cs143/cs143.1128)

### Day 11: Mon, Nov 16 — Parsing & AST Construction

- [ ] Recursive descent parsing — expressions, precedence, statements
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] AST design — nodes, visitors, tree traversal
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Parsing basics in Rust — build a hand-written parser
  - Site: [Rust Parsing Basics](https://domenicquirl.github.io/blog/parsing-basics/)

### Day 12: Tue, Nov 17 — Semantic Analysis & Interpreter

- [ ] Resolver — scopes, variable binding, static errors
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Evaluate expressions and statements — environments, closures
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Functions, classes and inheritance in the interpreter
  - Book: "Crafting Interpreters" by Robert Nystrom

### Rest Day: Wed, Nov 18 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 13: Thu, Nov 19 — Language Implementation Patterns

- [ ] Language implementation patterns — symbol tables, type checks
  - Book: "Language Implementation Patterns" by Terence Parr
- [ ] CMU 15-411 compiler labs — parse a C subset
  - Site: [CMU 15-411 Compiler Design](https://www.cs.cmu.edu/~janh/courses/411/16/schedule.html)
- [ ] Make a language in Rust — compare design choices
  - Site: [Make a Language in Rust](https://arzg.github.io/lang/)

### Day 14: Fri, Nov 20 — Bytecode Engine

- [ ] Bytecode instruction set and a stack-based VM loop
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Compile the AST to bytecode — locals, jumps, constant pool
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Survey next steps in compiler engineering
  - Site: [Awesome Compilers](https://github.com/aalhour/awesome-compilers)

### Day 15: Sat, Nov 21 — Garbage Collection & Optimizations

- [ ] Garbage collection — mark-sweep, roots, allocation tracking
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Bytecode optimizations — constant folding, peephole, superinstructions
- [ ] JIT basics — interpreters vs JIT, hot-region detection
  - Site: [Adventures in JIT Compilation](https://eli.thegreenplace.net/2017/adventures-in-jit-compilation-part-1-an-interpreter/)

### Rest Day: Sun, Nov 22 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 16: Mon, Nov 23 — VM Internals

- [ ] How to build a virtual machine
  - Video: [How to Build a Virtual Machine](https://www.youtube.com/watch?v=OjaAToVkoTw)
- [ ] JVM structure — class files, bytecode, execution engine
  - Site: [JVM Internals](https://blog.jamesdbloom.com/JVMInternals.html)
- [ ] V8 bytecode and Dart VM architecture — compare design choices
  - Site: [Understanding V8's Bytecode](https://medium.com/dailyjs/understanding-v8s-bytecode-317d46c94775)

### Day 17: Tue, Nov 24 — JIT Compilation

- [ ] JIT around your bytecode engine — compile hot loops to native code
  - Site: [Adventures in JIT Compilation](https://eli.thegreenplace.net/2017/adventures-in-jit-compilation-part-1-an-interpreter/)
- [ ] Speculation in JavaScriptCore — understanding type speculation
  - Site: [Speculation in JavaScriptCore](https://webkit.org/blog/10308/speculation-in-javascriptcore/)
- [ ] JS internals — V8 internals primer
  - Site: [Node.js V8 Internals](https://codeburst.io/node-js-v8-internals-an-illustrative-primer-83766e983bf6)

### Day 18: Wed, Nov 25 — Chip-8 Emulator (Project)

- [ ] Chip-8 architecture — memory map, registers, opcodes, timers
  - Site: [Chip-8 Design (Columbia)](https://www.cs.columbia.edu/~sedwards/classes/2016/4840-spring/designs/Chip8.pdf)
- [ ] Implement the CPU loop and the first 20 opcodes
- [ ] Render the display with SDL
  - Site: [NESdev Wiki](https://www.nesdev.org/wiki/Nesdev_Wiki)

### Rest Day: Thu, Nov 26 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 19: Fri, Nov 27 — LLVM & Compiled Languages

- [ ] LLVM IR, passes, and the clang toolchain
  - Site: [LLVM Documentation](https://llvm.org/docs/)
- [ ] Kaleidoscope — build a language front end on LLVM (Chapters 1–5)
  - Site: [LLVM Tutorial in Rust](https://github.com/jauhien/iron-kaleidoscope)
- [ ] Emit LLVM IR for a small compiled language targeting one architecture

### Day 20: Sat, Nov 28 — ROP Fundamentals

- [ ] ROP fundamentals — gadgets, chains, calling conventions in chains
  - Site: [ROP Emporium](https://ropemporium.com/index.html)
- [ ] Solve the first four ROP Emporium challenges (x86-64)
  - Site: [ROP Emporium](https://ropemporium.com/index.html)
- [ ] OMU exploitation labs — first lab
  - Site: [OMU Exploitation Labs](https://omu.rce.so/gcc-2022/)

### Day 21: Sun, Nov 29 — Heap & Format String Exploitation

- [ ] Heap exploitation — allocator metadata, use-after-free, tcache
  - Site: [Exploit Dev — Infosec Reference](https://github.com/rmusser01/Infosec_Reference/blob/master/Draft/Exploit_Dev.md)
- [ ] Format string vulnerabilities — read and write primitives
  - Site: [Nightmare](https://guyinatuxedo.github.io/index.html)
- [ ] Exploit education VMs — one challenge set
  - Site: [Exploit Education](https://exploit.education/)

### Rest Day: Mon, Nov 30 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 22: Tue, Dec 1 — Malware Analysis

- [ ] Static analysis — strings, imports, PE/ELF structure, packers
  - Book: "Practical Malware Analysis" by Michael Sikorski & Andrew Honig
- [ ] Dynamic analysis — sandboxing, process monitor, network capture
  - Book: "Practical Malware Analysis" by Michael Sikorski & Andrew Honig
- [ ] Malware analysis bootcamp — first lectures
  - Video: [Malware Analysis Bootcamp](https://www.youtube.com/playlist?list=PLBf0hzazHTGMSlOI2HZGc08ePwut6A2Io)

### Day 23: Wed, Dec 2 — OS Fundamentals

- [ ] Processes, threads, scheduling and virtual memory
  - Book: "Operating Systems: Three Easy Pieces" by Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau
  - Site: [OS: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/)
- [ ] Required knowledge for OS development — toolchain and prerequisites
  - Site: [OSDev Wiki — Required Knowledge](https://wiki.osdev.org/Required_Knowledge)
- [ ] Read Bootlin slides on kernel boot and memory layout
  - Site: [Bootlin Slides and Labs](https://bootlin.com/docs/)

### Day 24: Thu, Dec 3 — Boot Process & Toolchain

- [ ] Boot process — BIOS/UEFI, bootloader, protected/long mode
  - Site: [Little OS Book](https://littleosbook.github.io/)
- [ ] Cross-compiler and GRUB setup for a freestanding kernel
  - Site: [OSDev Wiki](https://wiki.osdev.org)
- [ ] Read OSDev Wiki boot section — step by step bootloader setup

### Rest Day: Fri, Dec 4 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

## Phase 2: Hands-On Projects

### Day 25: Sat, Dec 5 — Project: Minimal Kernel — Part 1

- [ ] Set up the kernel project skeleton — bootloader, linker script, Makefile
  - Site: [Writing an OS in Rust](https://os.phil-opp.com/)
- [ ] Print to screen through the VGA text buffer
  - Site: [Little OS Book](https://littleosbook.github.io/)
- [ ] Milestone: kernel boots and prints a message

### Day 26: Sun, Dec 6 — Project: Minimal Kernel — Part 2

- [ ] Set up the GDT and handle CPU exceptions
  - Site: [Writing an OS in Rust](https://os.phil-opp.com/)
- [ ] Program the PIC and handle keyboard interrupts
- [ ] Milestone: interrupts fire and input is echoed

### Day 27: Mon, Dec 7 — Project: Minimal Kernel — Part 3

- [ ] Implement page tables and a heap allocator
  - Site: [Writing an OS in Rust](https://os.phil-opp.com/)
- [ ] Add a simple in-memory filesystem or shell
- [ ] Milestone: kernel runs a small user program

### Rest Day: Tue, Dec 8 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 28: Wed, Dec 9 — Project: Chip-8 Emulator — Completion

- [ ] Implement the remaining opcodes and input handling
  - Site: [NESdev Wiki](https://www.nesdev.org/wiki/Nesdev_Wiki)
- [ ] Load and run test ROMs
  - Site: [Chip-8 Design (Columbia)](https://www.cs.columbia.edu/~sedwards/classes/2016/4840-spring/designs/Chip8.pdf)
- [ ] Milestone: a playable Chip-8 game runs

### Day 29: Thu, Dec 10 — Project: Language Compiler

- [ ] Finish bytecode engine for your interpreter with optimizations
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Add a JIT compiler for hot bytecode regions
  - Site: [Adventures in JIT Compilation](https://eli.thegreenplace.net/2017/adventures-in-jit-compilation-part-1-an-interpreter/)
- [ ] Benchmark interpreter vs JIT and write up the results

### Day 30: Fri, Dec 11 — Project: Pwn Practice

- [ ] Solve 5 more pwn.college challenges covering memory errors
  - Site: [pwn.college](https://pwn.college)
- [ ] Complete ROP Emporium (all challenges)
  - Site: [ROP Emporium](https://ropemporium.com/index.html)
- [ ] Solve 3 easy crackmes
  - Site: [crackmes.one](https://crackmes.one)

### Rest Day: Sat, Dec 12 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 31: Sun, Dec 13 — Reverse Engineering Practice

- [ ] Reverse a simple crackme with Ghidra — static analysis
  - Site: [Tutorial by 0xinfection](https://0xinfection.github.io/reversing/)
- [ ] Dynamic analysis of the same binary with gdb/pwndbg
  - Site: [Nightmare](https://guyinatuxedo.github.io/index.html)
- [ ] Write a short writeup for each challenge solved

### Day 32: Mon, Dec 14 — Malware Analysis Practice

- [ ] Analyze a safe sample — static analysis
  - Site: [Malware Bazaar](https://bazaar.abuse.ch/)
- [ ] Run Malware Unicorn workshop (beginner level)
  - Site: [Malware Unicorn](https://malwareunicorn.org/#/workshops)
- [ ] Practice with Sliver C2 setup (lab environment)
  - Site: [Sliver C2 Tutorial](https://dominicbreuker.com/post/learning_sliver_c2_01_installation/)

### Day 33: Tue, Dec 15 — Kernel & Emulator Polish

- [ ] Finish kernel project — add console (cursor, ANSI colors, scrolling)
  - Site: [Writing an OS in Rust](https://os.phil-opp.com/)
- [ ] Add a simple user shell to the kernel
- [ ] Add JIT block cache to the Chip-8 emulator

### Rest Day: Wed, Dec 16 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 34: Thu, Dec 17 — CTF & Wargames

- [ ] pwnable.kr — 3 more challenges
  - Site: [pwnable.kr](https://pwnable.kr)
- [ ] OverTheWire wargames — exploitation band
  - Site: [OverTheWire Wargames](https://overthewire.org/wargames)
- [ ] Write short writeups for each solved challenge

### Day 35: Fri, Dec 18 — Advanced Compiler Topics

- [ ] Control flow analysis — SSA form, data flow
  - Book: "Compilers: Principles, Techniques, and Tools" (Dragon Book) by Aho et al.
- [ ] Register allocation — graph coloring approach
  - Book: "Compilers: Principles, Techniques, and Tools" (Dragon Book) by Aho et al.
- [ ] Try OMU reverse engineering lessons
  - Site: [OMU reverse engineering lessons](https://omu.rce.so/lessons/reverse/)

### Day 36: Sat, Dec 19 — Intermediate Exploitation

- [ ] Heap exploitation — tcache poisoning, fastbin dup
  - Site: [Exploit Dev — Infosec Reference](https://github.com/rmusser01/Infosec_Reference/blob/master/Draft/Exploit_Dev.md)
- [ ] Windows x64 reversing — PE format, calling convention, WinDbg basics
  - Site: [Windows x64 Reverse Engineering](https://github.com/0xZ0F/Z0FCourse_ReverseEngineering)
- [ ] OSDev Wiki — paging and memory management tutorial
  - Site: [OSDev Wiki](https://wiki.osdev.org)

### Rest Day: Sun, Dec 20 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 37: Mon, Dec 21 — Capstone Architecture

- [ ] Inside the machine — front end, back end, execution units
  - Book: "Inside the Machine" by Jon Stokes
- [ ] Cache design — associativity, replacement policy, write policies
  - Book: "Computer Architecture: A Quantitative Approach" by David A. Patterson & John L. Hennessy

### Day 38: Tue, Dec 22 — Capstone Computer Systems

- [ ] Nand2Tetris Part II — continue building: memory unit, ISA, instruction fetch/decode/execute
  - Site: [Nand2Tetris](https://www.nand2tetris.org)
- [ ] Dive Into Systems — continue through CPU and memory chapters
  - Site: [Dive Into Systems](https://diveintosystems.org/)

### Day 39: Wed, Dec 23 — Integrated Review

- [ ] Pick one project and add documentation + README
- [ ] Review all reverse engineering writeups and consolidate learnings
- [ ] Explore VX Underground — browse malware analysis papers
  - Site: [VX Underground](https://www.vx-underground.org/)

### Rest Day: Thu, Dec 24 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 40: Fri, Dec 25 — CTF Challenge

- [ ] OverTheWire wargames — focus on exploitation band challenges
  - Site: [OverTheWire Wargames](https://overthewire.org/wargames)
- [ ] LiveOverflow binary exploitation series — watch first episodes
  - Video: [LiveOverflow Binary Exploitation](https://www.youtube.com/playlist?list=PLhixgUqwRTjxglIswKp9mpkfPNfHkzyeN)
- [ ] Solve 2 medium crackmes
  - Site: [crackmes.one](https://crackmes.one)

### Day 41: Sat, Dec 26 — Final Kernel Milestone

- [ ] Add process scheduling to your kernel
  - Book: "Operating Systems: Three Easy Pieces" by Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau
- [ ] Test with a user program that forks and runs concurrently
- [ ] Milestone: kernel supports multi-process execution

### Day 42: Sun, Dec 27 — Where to Go Next

- [ ] Browser hacking exploration — Chrome internals basics
  - Site: [Inside look at modern browser](https://developers.google.com/web/updates/2018/09/inside-browser-part1)
- [ ] Explore Awesome OS on GitHub
  - Site: [Awesome OS on GitHub](https://github.com/jubalh/awesome-os)
- [ ] Write a personal reflection: which area (compilers, exploitation, OS) interests you most and where to focus next

## Weekly Schedule Suggestion

- 1 hour theory per day block
- 2 hours hands-on coding per day block
- 1 hour review/notes per day block
- Rest days: no study tasks

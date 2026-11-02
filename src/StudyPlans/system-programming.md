# Study Plan: System Programming: Compilers, Exploitation & OS Fundamentals

Study days are **dated calendar days**, not numbered weeks. Nodes run on
consecutive calendar days in a **3 study + 1 rest rhythm**: three study days,
then one rest day, repeating. Day numbers continue across phase boundaries and
never restart.

## Phase 1: Low-Level Foundations

### Day 1: Tue, Nov 3 — C Foundations & the Memory Model

- [ ] C basics — pointers, arrays, structs, manual memory management
  - Site: [Beej's Guide to C Programming](https://beej.us/guide/bgc/)
- [ ] Compile a multi-file C project with a Makefile and debug it with gdb
- [ ] Digital electronics primer — logic gates, latches, memory hierarchy
  - Book: "Introduction to Digital Electronics" by Agner Fog

### Day 2: Wed, Nov 4 — Rust Ownership & Systems Tooling

- [ ] Rust fundamentals — ownership, borrowing, lifetimes, error handling
  - Site: [The Rust Programming Language](https://doc.rust-lang.org/stable/book/)
- [ ] Rust tooling — cargo, crates, unsafe blocks, FFI to C
  - Site: [The Rust Programming Language](https://doc.rust-lang.org/stable/book/)
- [ ] Solve 10 programming exercises in your chosen second language

### Day 3: Thu, Nov 5 — How Computers Execute Code

- [ ] How a CPU runs a program — fetch/decode/execute, registers, clock
  - Site: [cpu.land](https://cpu.land/)
- [ ] Memory layout — stack vs heap, segmentation, virtual addresses
- [ ] Build a small CLI tool in C or Rust (e.g. a hex dump utility)

### Rest Day: Fri, Nov 6 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 4: Sat, Nov 7 — ISA & Pipelining

- [ ] Instruction set architecture — RISC vs CISC, ARM vs RISC-V
  - Book: "Computer Organization and Design RISC-V Edition" by David A. Patterson & John L. Hennessy
- [ ] Pipelining — hazards, stalls, instruction-level parallelism
  - Book: "Computer Organization and Design ARM Edition" by David A. Patterson & John L. Hennessy

### Day 5: Sun, Nov 8 — Caches & Superscalar Design

- [ ] Cache design — associativity, replacement policy, write policies
  - Book: "Computer Architecture: A Quantitative Approach" by David A. Patterson & John L. Hennessy
- [ ] Superscalar execution — out-of-order, branch prediction, speculation
  - Book: "Modern Processor Design" by John Paul Shen & Mikko H. Lipasti
- [ ] Write a cache simulator and measure hit/miss rates

### Day 6: Mon, Nov 9 — Microarchitecture in Practice

- [ ] Inside the machine — front end, back end, execution units
  - Book: "Inside the Machine" by Jon Stokes
- [ ] CMU computer architecture lectures — pipelining and memory hierarchy
  - Video: [CMU Computer Architecture](https://www.youtube.com/channel/UCnoYy1k6I5gLIxhlNiStrdQ)
- [ ] Measure real cache effects with benchmarks on a tight loop

### Rest Day: Tue, Nov 10 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 7: Wed, Nov 11 — Assembly Basics

- [ ] Registers, stack, syscalls — write hello-world in NASM
  - Site: [NASM Tutorial](https://cs.lmu.edu/~ray/notes/nasmtutorial/)
- [ ] Assembler toolchain — assemble, link, inspect with objdump and readelf
  - Site: [ASM Tutor](https://asmtutor.com/)
- [ ] x86-64 lessons — arithmetic, control flow, loops
  - Site: [OMU x86-64 Lessons](https://omu.rce.so/lessons/asm-x86-64/)

### Day 8: Thu, Nov 12 — Calling Conventions & ABI

- [ ] System V AMD64 calling convention — argument passing, stack frames, alignment
  - Site: [x86 Quickstart (NASM)](https://cs.lmu.edu/~ray/notes/nasmtutorial/)
- [ ] Map C to assembly — compile small C programs and read the disassembly
  - Site: [Compiler Explorer](https://godbolt.org/)
- [ ] Write a function in assembly and call it from C

### Day 9: Fri, Nov 13 — Reading Disassembly

- [ ] Intel SDM — instruction encodings, operand forms, flags
  - Site: [Intel 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
- [ ] Reversing x86 and C for beginners — identify loops, switches, structs
  - Site: [Reversing x86 and C for Beginners](https://0x44.cc/reversing/2021/07/21/reversing-x86-and-c-code-for-beginners.html)
- [ ] Solve 3 easy crackmes
  - Site: [crackmes.one](https://crackmes.one)

### Rest Day: Sat, Nov 14 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

## Phase 2: Compilers & VM Internals

### Day 10: Sun, Nov 15 — Language Design & Scanning

- [ ] Define a small language — grammar, syntax, semantics
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Scanner — tokens, lexemes, hand-written lexer
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Stanford CS143 — lexing and finite automata notes
  - Site: [Stanford CS143 Compilers](https://web.stanford.edu/class/archive/cs/cs143/cs143.1128)

### Day 11: Mon, Nov 16 — Parsing & ASTs

- [ ] Recursive descent parsing — expressions, precedence, statements
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] AST design — nodes, visitors, tree traversal
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Parsing basics in Rust — build a hand-written parser
  - Site: [Rust Parsing Basics](https://domenicquirl.github.io/blog/parsing-basics/)

### Day 12: Tue, Nov 17 — Semantic Analysis & Patterns

- [ ] Resolver — scopes, variable binding, static errors
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Language implementation patterns — symbol tables, type checks
  - Book: "Language Implementation Patterns" by Terence Parr
- [ ] CMU 15-411 compiler labs — parse a C subset
  - Site: [CMU 15-411 Compiler Design](https://www.cs.cmu.edu/~janh/courses/411/16/schedule.html)

### Rest Day: Wed, Nov 18 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 13: Thu, Nov 19 — Tree-Walk Interpreter

- [ ] Evaluate expressions and statements — environments, closures
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Functions, classes and inheritance in the interpreter
  - Book: "Crafting Interpreters" by Robert Nystrom

### Day 14: Fri, Nov 20 — Bytecode & Stack Machine

- [ ] Bytecode instruction set and a stack-based VM loop
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Compile the AST to bytecode — locals, jumps, constant pool
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Make a language in Rust — compare design choices
  - Site: [Make a Language in Rust](https://arzg.github.io/lang/)

### Day 15: Sat, Nov 21 — Garbage Collection & Optimization

- [ ] Garbage collection — mark-sweep, roots, allocation tracking
  - Book: "Crafting Interpreters" by Robert Nystrom
- [ ] Bytecode optimizations — constant folding, peephole, superinstructions
- [ ] Survey next steps in compiler engineering
  - Site: [Awesome Compilers](https://github.com/aalhour/awesome-compilers)

### Rest Day: Sun, Nov 22 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 16: Mon, Nov 23 — LLVM Toolchain

- [ ] LLVM IR, passes, and the clang toolchain
  - Site: [LLVM Documentation](https://llvm.org/docs/)
- [ ] Kaleidoscope — build a language front end on LLVM
  - Site: [LLVM Tutorial in Rust](https://github.com/jauhien/iron-kaleidoscope)
- [ ] Emit LLVM IR for a small compiled language targeting one architecture

### Day 17: Tue, Nov 24 — JIT Compilation

- [ ] JIT basics — interpreters vs JIT, hot-region detection
  - Site: [Adventures in JIT Compilation](https://eli.thegreenplace.net/2017/adventures-in-jit-compilation-part-1-an-interpreter/)
- [ ] JIT around your bytecode engine — compile hot loops to native code
- [ ] Build a virtual machine from first principles
  - Video: [How to Build a Virtual Machine](https://www.youtube.com/watch?v=OjaAToVkoTw)

### Day 18: Wed, Nov 25 — VM Internals

- [ ] JVM structure — class files, bytecode, execution engine
  - Site: [JVM Internals](https://blog.jamesdbloom.com/JVMInternals.html)
- [ ] V8 bytecode and Dart VM architecture — compare design choices
  - Site: [Understanding V8's Bytecode](https://medium.com/dailyjs/understanding-v8s-bytecode-317d46c94775)
  - Site: [Dart VM Architecture](https://mrale.ph/dartvm/)

### Rest Day: Thu, Nov 26 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

## Phase 3: Exploitation & Reverse Engineering

### Day 19: Fri, Nov 27 — Memory Corruption Fundamentals

- [ ] Stack layout and buffer overflows — overwrite the return address
  - Site: [pwn.college](https://pwn.college)
- [ ] Shellcode basics — write and run position-independent shellcode
  - Site: [Introduction to Exploit Development](https://samsclass.info/127/ED_2020.shtml)
- [ ] Systems hacking handbook — introduction and tooling setup
  - Site: [ike: Systems Hacking Handbook](https://ike.mahaloz.re/1_introduction/introduction.html)

### Day 20: Sat, Nov 28 — Debugging & Writing Exploits

- [ ] Debug an overflow with gdb/pwndbg — find offsets, control the instruction pointer
  - Site: [Nightmare](https://guyinatuxedo.github.io/index.html)
- [ ] Mitigations primer — NX, stack canaries, PIE, ASLR
  - Site: [CS6265 Reverse Engineering and Binary Exploitation Lab](https://tc.gts3.org/cs6265/2021/_static/tut.pdf)
- [ ] Solve 3 pwn.college modules on memory errors

### Day 21: Sun, Nov 29 — Exploitation Practice

- [ ] OMU exploitation labs — first lab
  - Site: [OMU Exploitation Labs](https://omu.rce.so/gcc-2022/)
- [ ] LiveOverflow binary exploitation series — first episodes
  - Video: [LiveOverflow Binary Exploitation](https://www.youtube.com/playlist?list=PLhixgUqwRTjxglIswKp9mpkfPNfHkzyeN)
- [ ] Solve 2 easy pwn challenges
  - Site: [pwnable.kr](https://pwnable.kr)

### Rest Day: Mon, Nov 30 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 22: Tue, Dec 1 — Return-Oriented Programming

- [ ] ROP fundamentals — gadgets, chains, calling conventions in chains
  - Site: [ROP Emporium](https://ropemporium.com/index.html)
- [ ] Solve the first four ROP Emporium challenges (x86-64)
  - Site: [ROP Emporium](https://ropemporium.com/index.html)

### Day 23: Wed, Dec 2 — Heap & Format Strings

- [ ] Heap exploitation — allocator metadata, use-after-free, tcache
  - Site: [Exploit Dev — Infosec Reference](https://github.com/rmusser01/Infosec_Reference/blob/master/Draft/Exploit_Dev.md)
- [ ] Format string vulnerabilities — read and write primitives
  - Site: [Nightmare](https://guyinatuxedo.github.io/index.html)
- [ ] Exploit education VMs — one challenge set
  - Site: [Exploit Education](https://exploit.education/)

### Day 24: Thu, Dec 3 — Windows Exploitation

- [ ] Windows x64 reversing — PE format, calling convention, WinDbg
  - Site: [Windows x64 Reverse Engineering](https://github.com/0xZ0F/Z0FCourse_ReverseEngineering)
- [ ] Win32 API programming basics for exploit dev
  - Site: [Win32 API Programming](https://riptutorial.com/Download/win32-api.pdf)
- [ ] Survey Windows exploit development techniques
  - Site: [Windows Exploitation Resources](https://github.com/FULLSHADE/WindowsExploitationResources)

### Rest Day: Fri, Dec 4 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 25: Sat, Dec 5 — Reverse Engineering Workflow

- [ ] Reversing workflow — static vs dynamic analysis, Ghidra basics
  - Site: [Tutorial by 0xinfection](https://0xinfection.github.io/reversing/)
- [ ] Reversing x86 and C for beginners — crackme walkthroughs
  - Site: [Reversing x86 and C for Beginners](https://0x44.cc/reversing/2021/07/21/reversing-x86-and-c-code-for-beginners.html)
- [ ] Solve 3 medium crackmes
  - Site: [crackmes.one](https://crackmes.one)

### Day 26: Sun, Dec 6 — Malware Analysis Foundations

- [ ] Static analysis — strings, imports, PE/ELF structure, packers
  - Book: "Practical Malware Analysis" by Michael Sikorski & Andrew Honig
- [ ] Dynamic analysis — sandboxing, process monitor, network capture
  - Book: "Practical Malware Analysis" by Michael Sikorski & Andrew Honig
- [ ] Malware analysis bootcamp — first lectures
  - Video: [Malware Analysis Bootcamp](https://www.youtube.com/playlist?list=PLBf0hzazHTGMSlOI2HZGc08ePwut6A2Io)

### Day 27: Mon, Dec 7 — CTF Practice

- [ ] pwnable.kr — 3 more challenges
  - Site: [pwnable.kr](https://pwnable.kr)
- [ ] OverTheWire wargames — exploitation band
  - Site: [OverTheWire Wargames](https://overthewire.org/wargames)
- [ ] Write a short writeup for each solved challenge

### Rest Day: Tue, Dec 8 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

## Phase 4: OS Fundamentals & Hands-On Projects

### Day 28: Wed, Dec 9 — OS Concepts

- [ ] Processes, threads, scheduling and virtual memory
  - Book: "Operating Systems: Three Easy Pieces" by Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau
- [ ] Required knowledge for OS development — toolchain and prerequisites
  - Site: [OSDev Wiki — Required Knowledge](https://wiki.osdev.org/Required_Knowledge)
- [ ] Linux kernel labs — kernel modules and system calls
  - Site: [Linux Kernel Labs](https://linux-kernel-labs.github.io/refs/heads/master/)

### Day 29: Thu, Dec 10 — Boot & Low-Level Setup

- [ ] Boot process — BIOS/UEFI, bootloader, protected/long mode
  - Site: [Little OS Book](https://littleosbook.github.io/)
- [ ] Cross-compiler and GRUB setup for a freestanding kernel
  - Site: [OSDev Wiki](https://wiki.osdev.org)
- [ ] Read Bootlin slides on kernel boot and memory layout
  - Site: [Bootlin Slides and Labs](https://bootlin.com/docs/)

### Day 30: Fri, Dec 11 — Kernel Subsystems

- [ ] Interrupts, GDT/IDT and exception handling
  - Book: "539kernel: A Journey in Creating an OS Kernel" by Mohammed Q. Hussain
- [ ] Paging and physical memory management
  - Book: "Operating Systems: Three Easy Pieces" by Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau
- [ ] Broken Thorn tutorials — bootloader to kernel in 32-bit
  - Site: [Broken Thorn OS Development Series](http://www.brokenthorn.com/Resources/)

### Rest Day: Sat, Dec 12 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 31: Sun, Dec 13 — Project: Minimal Kernel

- [ ] Set up the kernel project skeleton — bootloader, linker script, Makefile
  - Site: [Writing an OS in Rust](https://os.phil-opp.com/)
- [ ] Print to screen through the VGA text buffer
  - Site: [Little OS Book](https://littleosbook.github.io/)
- [ ] Milestone: kernel boots and prints a message

### Day 32: Mon, Dec 14 — Project: Minimal Kernel

- [ ] Set up the GDT and handle CPU exceptions
  - Site: [Writing an OS in Rust](https://os.phil-opp.com/)
- [ ] Program the PIC and handle keyboard interrupts
- [ ] Milestone: interrupts fire and input is echoed

### Day 33: Tue, Dec 15 — Project: Minimal Kernel

- [ ] Implement page tables and a heap allocator
  - Site: [Writing an OS in Rust](https://os.phil-opp.com/)
- [ ] Add a simple in-memory filesystem or shell
- [ ] Milestone: kernel runs a small user program

### Rest Day: Wed, Dec 16 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 34: Thu, Dec 17 — Project: Chip-8 Emulator

- [ ] Chip-8 architecture — memory map, registers, opcodes, timers
  - Site: [Chip-8 Design (Columbia)](https://www.cs.columbia.edu/~sedwards/classes/2016/4840-spring/designs/Chip8.pdf)
- [ ] Implement the CPU loop and the first 20 opcodes
- [ ] Render the display with SDL

### Day 35: Fri, Dec 18 — Project: Chip-8 Emulator

- [ ] Implement the remaining opcodes and input handling
- [ ] Load and run test ROMs
  - Site: [NESdev Wiki](https://www.nesdev.org/wiki/Nesdev_Wiki)
- [ ] Milestone: a playable Chip-8 game runs

### Day 36: Sat, Dec 19 — Project: JIT for the Emulator

- [ ] Profile the emulator and identify hot opcode dispatch loops
  - Site: [Adventures in JIT Compilation](https://eli.thegreenplace.net/2017/adventures-in-jit-compilation-part-1-an-interpreter/)
- [ ] Add a block cache that JITs hot blocks to native code
- [ ] Benchmark before/after and write up the results

## Weekly Schedule Suggestion

- 1 hour theory per day block
- 2 hours hands-on coding per day block
- 1 hour review/notes per day block
- Rest days: no study tasks

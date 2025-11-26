---
layout: page
title: snap-select
description: offline ai text selection tool
importance: 1
category: all
---

An [open-source](https://github.com/danielmkv/snap-select-elct) AI-powered offline screenshot and OCR tool built with Electron. Snap-Select enables users to capture any text directly from their screen and automatically copy it to their clipboard using advanced optical character recognition technology.

**Key Features:**
- **Multi-monitor support**: Intelligent display detection and capture across multiple screens
- **Offline OCR processing**: Uses PaddleOCR for high-accuracy text extraction without internet connection
- **Real-time text extraction**: Seamlessly extracts text from screenshots with confidence scoring
- **Cross-platform desktop app**: Built with Electron for native performance on Windows, macOS, and Linux
- **Overlay UI**: Transparent overlay system for precise area selection

**Technical Implementation:**
- Developed custom screen capture system using Electron's `desktopCapturer` API with multi-display support
- Implemented Python-based OCR pipeline using PaddleOCR with configurable detection thresholds
- Built IPC (Inter-Process Communication) bridge between Electron main process and Python OCR script
- Created coordinate transformation system to handle high-DPI displays and relative monitor positioning
- Utilized Sharp image processing library for efficient screenshot cropping and manipulation
- Designed transparent overlay window system with per-monitor capture capabilities

**Architecture:**
- **Frontend**: Electron renderer process with HTML/CSS overlay UI
- **Main Process**: Node.js with IPC handlers for screen capture coordination
- **OCR Engine**: Python 3 with PaddleOCR for text detection and recognition
- **Image Processing**: Sharp library for efficient PNG manipulation and cropping

**Timeline:** August 2024 - Present

**Technologies:** Electron, JavaScript (ES6 modules), Python 3, PaddleOCR, Sharp, Node.js, IPC

"""Renders the original background music used by the invitations (assets/audio/wedding-loop.mp3).

An original composition: tanpura drone, santoor-like plucks, a bansuri-like melody in Yaman colour and a
soft dholak, 76 BPM, 63 s, with the tail folded back so it loops without a seam. Free to use — no samples.

Usage:  python3 scripts/invitation-music.py out.wav   (needs numpy)
        ffmpeg -i out.wav -af "highpass=f=45,loudnorm=I=-18:TP=-1.5:LRA=11" -b:a 160k wedding-loop.mp3
"""
import sys, wave
import numpy as np

SR = 44100
BPM = 76
BEAT = 60 / BPM
BARS = 20                      # 4 beats each
LOOP = BARS * 4 * BEAT         # seconds in the loop
TAIL = 4.0                     # rendered past the loop end, folded back for a seamless loop
N = int((LOOP + TAIL) * SR)
rng = np.random.default_rng(7)

SA = 293.66                    # D4
SEMI = {'S': 0, 'r': 1, 'R': 2, 'g': 3, 'G': 4, 'm': 5, 'M': 6, 'P': 7, 'd': 8, 'D': 9, 'n': 10, 'N': 11}


def freq(note):
    """'G', "S'" (upper octave) or '.P' (lower octave)."""
    octave = note.count("'") - note.count('.')
    return SA * 2 ** ((SEMI[note.strip(".'")] + 12 * octave) / 12)


L = np.zeros(N)
R = np.zeros(N)


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / decay)


def tanpura(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for k in range(1, 14):          # rich harmonics, slowly beating like jawari buzz
        amp = (1 / k) * (0.6 + 0.4 * np.sin(2 * np.pi * (0.15 + 0.05 * k) * t + k)) ** 2
        s += amp * np.sin(2 * np.pi * f * k * (1 + 0.0007 * np.sin(2 * np.pi * 0.3 * t)) * t)
    return s * env(n, 0.04, dur * 0.45)


def santoor(f, dur=2.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for k, (ratio, amp, dec) in enumerate([(1, 1, 0.9), (2.0, 0.45, 0.5), (3.01, 0.22, 0.32), (4.2, 0.1, 0.18), (5.4, 0.05, 0.1)]):
        s += amp * np.exp(-t / dec) * np.sin(2 * np.pi * f * ratio * t + k)
        s += 0.5 * amp * np.exp(-t / dec) * np.sin(2 * np.pi * f * ratio * 1.003 * t)   # double course
    return s * np.minimum(1, t / 0.002)


def bansuri(f, dur, glide_from=None):
    n = int(dur * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / 0.4)
    if glide_from:                  # meend: slide into the note
        g = np.minimum(1, t / 0.18)
        fr = (glide_from * (1 - g) + f * g) * vib
    else:
        fr = f * vib
    ph = 2 * np.pi * np.cumsum(fr) / SR
    s = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
    breath = rng.normal(0, 1, n)
    breath = np.convolve(breath, np.ones(30) / 30, mode='same') * 0.05
    a = np.minimum(1, t / 0.12) * np.minimum(1, (dur - t) / 0.25).clip(0, 1)
    return (s + breath) * a


def dholak(kind):
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    if kind == 'ga':                # low open stroke with a pitch drop
        f = 95 + 60 * np.exp(-t / 0.03)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16)
    noise = rng.normal(0, 1, n) * np.exp(-t / 0.02)
    return 0.5 * noise + 0.6 * np.sin(2 * np.pi * 420 * t) * np.exp(-t / 0.05)   # 'na' slap


# ---------------------------------------------------------------- drone: Pa Sa' Sa' Sa (lower), every bar
for bar in range(BARS + 2):
    t0 = bar * 4 * BEAT
    for j, note in enumerate(['.P', 'S', 'S', '.S']):
        add(tanpura(freq(note) / 2, 4.5), t0 + j * BEAT, pan=-0.3 + 0.2 * j, gain=0.075)

# ---------------------------------------------------------------- santoor arpeggios from bar 2
patterns = [['S', 'G', 'P', "S'", 'P', 'G', 'P', 'G'], ['.D', 'S', 'G', 'P', 'G', 'S', 'G', 'S'],
            ['R', 'M', 'D', "R'", 'D', 'M', 'D', 'P'], ['S', 'G', 'P', 'D', 'P', 'G', 'R', 'S']]
for bar in range(2, BARS):
    pat = patterns[bar % 4]
    for j, note in enumerate(pat):
        t = bar * 4 * BEAT + j * BEAT / 2
        if bar >= BARS - 2 and j > 3:
            continue
        add(santoor(freq(note)), t + rng.uniform(0, 0.012), pan=0.35 * np.sin(j), gain=0.11 if j % 2 else 0.15)

# ---------------------------------------------------------------- bansuri melody (Yaman colour), bars 4–17
melody = [  # (note, beats)
    ('G', 1), ('P', 1), ('D', 1.5), ('P', 0.5), ('G', 2), ('R', 1), ('S', 1),
    ('R', 1), ('G', 1), ('M', 1), ('P', 1), ('G', 3), ('-', 1),
    ('P', 1), ('D', 1), ("S'", 2), ('N', 1), ('D', 1), ('P', 2),
    ('G', 1), ('M', 1), ('D', 1), ('P', 1), ('G', 2), ('R', 1), ('S', 1),
    ('.N', 1), ('R', 1), ('G', 2), ('P', 1), ('G', 1), ('R', 2),
    ('G', 1), ('P', 1), ('D', 1), ("S'", 1), ("R'", 1.5), ("S'", 0.5), ('D', 2),
    ('P', 1), ('M', 1), ('G', 1), ('R', 1), ('S', 4),
]
t = 4 * 4 * BEAT
prev = None
for note, beats in melody:
    d = beats * BEAT
    if note != '-':
        f = freq(note)
        add(bansuri(f, d * 0.98 + 0.15, glide_from=prev if prev and abs(np.log2(prev / f)) < 0.2 else None), t, pan=0.1, gain=0.16)
        prev = f
    t += d

# ---------------------------------------------------------------- soft dholak (keherwa feel), bars 4–18
groove = [('ga', 0), ('na', 1), ('na', 1.5), ('ga', 2), ('ga', 2.5), ('na', 3)]
for bar in range(4, BARS - 1):
    for kind, b in groove:
        add(dholak(kind), bar * 4 * BEAT + b * BEAT, pan=-0.1, gain=0.22 if kind == 'ga' else 0.1)

# ---------------------------------------------------------------- reverb (FFT convolution with a decaying noise tail)
def reverb(x, secs=2.6, mix=0.28, seed=1):
    r = np.random.default_rng(seed)
    n = int(secs * SR)
    ir = r.normal(0, 1, n) * np.exp(-np.arange(n) / SR / (secs / 5))
    ir[0] = 0
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    wet /= np.max(np.abs(wet)) + 1e-9
    return x + mix * wet * np.max(np.abs(x))


L, R = reverb(L, seed=1), reverb(R, seed=2)

# fold the tail back onto the start so the loop has no seam
loopN = int(LOOP * SR)
tailN = N - loopN
fade = np.linspace(0, 1, tailN)
for ch in (L, R):
    ch[:tailN] = ch[:tailN] * fade + ch[loopN:] * (1 - fade)
out = np.stack([L[:loopN], R[:loopN]], axis=1)
out /= np.max(np.abs(out)) * 1.12                     # headroom
pcm = (out * 32767).astype(np.int16)

with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f'{LOOP:.1f}s loop written')

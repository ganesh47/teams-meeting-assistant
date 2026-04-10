#!/usr/bin/env python3
import argparse
import json
import wave
from pathlib import Path

from faster_whisper import WhisperModel


def raw_to_wav(raw_path: Path, wav_path: Path, sample_rate: int, channels: int):
    data = raw_path.read_bytes()
    with wave.open(str(wav_path), 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(data)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--model', default='base')
    parser.add_argument('--sample-rate', type=int, required=True)
    parser.add_argument('--channels', type=int, required=True)
    args = parser.parse_args()

    input_path = Path(args.input)
    wav_path = input_path.with_suffix('.wav')
    output_path = Path(args.output)

    raw_to_wav(input_path, wav_path, args.sample_rate, args.channels)

    model = WhisperModel(args.model)
    segments, _info = model.transcribe(str(wav_path))

    payload = {
        'segments': [
            {
                'text': segment.text.strip(),
                'start_ms': int(segment.start * 1000),
                'end_ms': int(segment.end * 1000),
            }
            for segment in segments
        ]
    }
    output_path.write_text(json.dumps(payload), encoding='utf-8')


if __name__ == '__main__':
    main()

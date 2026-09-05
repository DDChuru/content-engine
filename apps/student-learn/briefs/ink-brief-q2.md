# Ink brief: chain rule (directed by Fable, drawn by you)

You are the tutor's HAND. I have already decided what is said and in what order. Your job is
to write it on lined paper as real pen strokes, exactly the way a tutor scribbles beside a student.

## Question
Find dy/dx when y = (2x + 1)^5

## Beats (write exactly these groups, in this order, nothing more)
- line1: write `y = (2x + 1)^5`
- line2: write `let u = 2x + 1` and, further right on the same line, `y = u^5`
- line3: write `dy/du = 5u^4` as a real fraction (dy above a bar, du below), then to the right `du/dx = 2` as a fraction
- line4: write `dy/dx = 5u^4 × 2 = 10(2x + 1)^4` with dy/dx as a fraction
- answer: a loose red-pen oval around line4 (one or two strokes, start at the left, overrun slightly)
- annot: a short red arrow pointing at the `×` on line4, and the words `chain rule` in small handwriting next to it

## Canvas
800 wide. Left margin at x = 80. Baselines at y = 140, 250, 360, 480 for lines 1 to 4.
x-height about 30px. Superscripts 60% size, raised 25px. Fraction numerator sits 20px above
the bar, denominator 26px below, both at 80% size. Leave the top 100px empty.

## Strokes
Every character is one or more SVG paths written in pen order. Slightly wobbly, like a hand,
but every symbol must be unambiguous: 1 vs l, u vs v, 5 vs s, 2 vs z. Use ONLY M L Q C H V
commands (upper case) with absolute coordinates, numbers, spaces and commas. No text elements,
no fonts, no transforms, no arcs.

## Output format (one item per line, nothing else)
GROUP line1
SAY We're given y equals two x plus one, all to the power five.
PATH M 80 116 Q 83 130 89 140
PATH ...
GROUP line2
SAY Bracket to a power? Let u be the inside. So y is just u to the five.
PATH ...

Use exactly these SAY lines:
- line1: We're given y equals two x plus one, all to the power five.
- line2: Bracket to a power? Let u be the inside. So y is just u to the five.
- line3: Differentiate each part. dy by du is five u to the power four. du by dx is two.
- line4: Chain rule: multiply them. Then put the inside back.
- answer: So dy by dx is ten, times two x plus one, to the power four.
- annot: That multiply step is the chain rule. Every time.

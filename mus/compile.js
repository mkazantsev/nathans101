var endTime = function (time, expr) {
    if (expr.tag == 'seq') {
        return endTime(endTime(time, expr.left), expr.right);
    } else if (expr.tag == 'par') {
        var ldur = expr.left.dur,
            rdur = expr.right.dur;
        return ldur < rdur ? rdur : ldur;
    } else if (expr.tag == 'note') {
        return time + expr.dur;
    } else if (expr.tag == 'rest') {
		return time + expr.duration;
	}
};

var convertPitch = function (pitch) {
	var letter = pitch.charAt(0),
		octave = pitch.charAt(1),
		letterPitch = 0;

	if (letter == 'd') {
		letterPitch = 2;
	} else if (letter == 'e') {
		letterPitch = 4;
	} else if (letter == 'f') {
		letterPitch = 5;
	} else if (letter == 'g') {
		letterPitch = 7;
	} else if (letter == 'a') {
		letterPitch = 9;
	} else if (letter == 'b') {
		letterPitch = 11;
	}

	return 12 + 12 * octave + letterPitch;
};

var compile = function (musexpr) {
    var i = 0, a = [], left, right;
    if (musexpr.tag == 'note') {
        return [{
            tag: 'note',
            pitch: convertPitch(musexpr.pitch),
            start: 0,
            dur: musexpr.dur
        }];
	} else if (musexpr.tag == 'rest') {
		return [{
			tag: 'rest',
			pitch: null,
			start: 0,
			dur: musexpr.duration
		}];
    } else if (musexpr.tag == 'par') {
        left = compile(musexpr.left);
        right = compile(musexpr.right);
        for (i = 0, len = left.length; i < len; i++) {
            a.push(left[i]);
        }
        for (i = 0, len = right.length; i < len; i++) {
            a.push(right[i]);
        }
        return a;
    } else if (musexpr.tag == 'seq') {
        left = compile(musexpr.left);
        right = compile(musexpr.right);
        var time = endTime(0, musexpr.left);
        for (i = 0, len = left.length; i < len; i++) {
            a.push(left[i]);
        }
        for (i = 0, len = right.length; i < len; i++) {
            right[i].start += time;
            a.push(right[i]);
        }
        return a;
    }
};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));

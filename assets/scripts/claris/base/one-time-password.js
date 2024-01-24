var debug_otp = false;

var clog = function(s) { if (debug_otp && typeof(window.console) != 'undefined') console.log(s); }

var inp_min_cc = 32; // minimal char code of string to obfuscate
var out_min_cc = 35; // minimal char code of obfuscated string

String.prototype.html_encode = function () {
	return this .replace(/&/g,'&amp;') /*.replace(/'/g,'&apos;') .replace(/"/g,'&quot;')*/ .replace(/</g,'&lt;') .replace(/>/g,'&gt;') /*.replace(/\\/g,'&#92;')*/;
};
String.prototype.html_decode = function () {
	return this .replace(/&amp;/g,'&') /*.replace(/&apos;/g,"'") .replace(/&quot;/g,'"')*/ .replace(/&lt;/g,'<') .replace(/&gt;/g,'>') /*.replace(/&#92;/g,'\\')*/;
};
var randstr_lowercase = function(la) {
	rand_e = function(s,n) {return new Array(++n).join(s);};
	return rand_e('0',(la == undefined ? 8 : la)).replace(/0/g,function(c){return String.fromCharCode(97+Math.floor(Math.random()*26));});
}
var randint = function(a1,a2) {
	if (typeof(a2) == 'undefined')
		return Math.floor(Math.random() * (a1 == undefined ? 1 : a1+1));
	return a1 + Math.floor(Math.random() * (a2-a1));	
}

function uri_charcodes() {
	var n = 0, a = new Array(), b = new Array();
	for (var i=out_min_cc; i < 127; ++i) {
		var c = String.fromCharCode(i);
		if (c.match(/[^"'\\]/) && c == encodeURI(c)) {
			a.push(i);
			b[i] = true;
			++n;
		}
		else {
			b[i] = false;
		}
	}
	// Sanity check
	clog("uri_charcodes(): Sanity check");
	for (var i=inp_min_cc; i < 127; ++i) {
		var ok = false;
		// clog("Check if character i="+i+": '"+String.fromCharCode(i)+"' can be encoded");
		for (var idxe=0; ! ok && idxe < n; ++idxe) {
			var e = a[idxe];
			// Now we need k such that (e-out_min_cc)+(k-out_min_cc) = i - inp_min_cc;
			// k = i - e + 2*out_min_cc - inp_min_cc
			var k =  i - e + 2*out_min_cc - inp_min_cc;
			// var dbstr = "idxe="+idxe+" e="+e+": '"+String.fromCharCode(e)
			// 	+"' k="+k+": '"+String.fromCharCode(k)+"'\n\n"
			if (b[k]) {
				// clog("  Can be encoded: "+dbstr);
				ok = true;
			}
			// else {
			// 	clog("  Cannot be encoded. "+dbstr);
			// }
		}
		if (! ok) {
			alert("Cannot encode character '"+String.fromCharCode(i)+"'");
			return false;
		}
	}
	return {charcode: a, length: n, contains: b};
}
function obfuscate_js(p,a,t) {
	var ae = encodeURI(a);
	var len = ae.length;
	var uri = {};
	if ((uri = uri_charcodes()) == false) {
		return false;
	};
	var uri_char = uri['charcode'],uri_contains = uri['contains'], uri_a_len = uri['length'];
	var out_min_cc = uri_char[0];
	clog("\nfunction obfuscate_js(p='"+p+", a='"+a+", ae='"+ae+"', t='"+t+")");
	var ea = new Array(), ka = new Array();
	for (var i=0; i < len; ++i) {
		var tmp = new Array();
		var ai = ae.charCodeAt(i);
		var rmin = out_min_cc + Math.min(0, (ai-inp_min_cc));
		var rmax = out_min_cc + Math.max(0, (ai-inp_min_cc));
		var range = rmax - rmin;
		clog('  c='+ae.charAt(i)+' ai='+ai+' uri_a_len='+uri_a_len+ ' out_min_cc='+out_min_cc
			+' ai='+ai+' rmin='+rmin+' rmax='+rmax+ ' range='+range);
		for (var j=0; j<range; ++j) {
			var ei = rmin + j;
			var ki = out_min_cc + (ai-inp_min_cc) - (ei-out_min_cc);
			clog('\n    ei='+ei+": '"+String.fromCharCode(ei)
				+"' uri_contains[ei]="+uri_contains[ei]
				+'\n    ki='+ki+": '"+String.fromCharCode(ki)
				+"' uri_contains[ki]="+uri_contains[ki]);
			if (uri_contains[ei] && uri_contains[ki]) {
				tmp.push({ei: ei, ki: ki});
				clog("    Candidate "+tmp.length
					+": ei="+tmp[tmp.length-1]['ei']+": '"+String.fromCharCode(tmp[tmp.length-1]['ei'])
					+"' ki="+tmp[tmp.length-1]['ki']+": '"+String.fromCharCode(tmp[tmp.length-1]['ki'])+"'"
					+" decoded: di="+(inp_min_cc
						+tmp[tmp.length-1]['ei']-out_min_cc
						+tmp[tmp.length-1]['ki']-out_min_cc)
					+": '"+String.fromCharCode(
						tmp[tmp.length-1]['ei']-out_min_cc
						+tmp[tmp.length-1]['ki']-out_min_cc)+"'");
			}
		}
		var r = randint(0, tmp.length-1);
		ea[i] = String.fromCharCode(tmp[r]['ei']);
		ka[i] = String.fromCharCode(tmp[r]['ki']);
		clog("\n  OK: ea["+i+"]='"+ ea[i]+"' ki["+i+"]='"+ka[i]+"'\n\n");
	}
	var e = String(ea.join('')), k = String(ka.join('')), d = new Array();
	for (var i=0; i < e.length; ++i) {
		d[i] = String.fromCharCode(
			inp_min_cc + (e.charCodeAt(i)-out_min_cc) 
		+ (k.charCodeAt(i)-out_min_cc));
	}
	var js = 'var p="'+p+'",e="'+e+'",k="'+k+'", m=new Array();'
		+ 'for(var i=0;i<e.length;++i){'
		+ 'm[i]=String.fromCharCode(e.charCodeAt(i)+k.charCodeAt(i)-'
		+(-inp_min_cc+2*out_min_cc)+');}m=decodeURI(m.join(\'\'));'
	 	+ 'document.write(\'<a href="\'+p+m+\'" title="'+t+'">\'+m+\'</a>\');';
	clog('  e: '+e+'\n  k: '+k+'\n  d: '+d.join('')+'\njs='+js);
	return js;
};
function obfuscate_nojs(a) {
	var len=a.length, line1 = '', line2 = '  ', space = ' ';
	clog("\nfunction obfuscate_nojs(a='"+a+")");
	for (var i=0;i<len;++i) {
		if (a.charAt(i) == '@') {
			if ((i%2) == 0) {
				line1 += '     ';
				line2 += ' ';
			} else {
				line1 += ' ';
				line2 += '     ';			
			}
			space = space.substr(0,space.length-3) + '  AT  '
		}
		else {
			if ((i%2) == 0) {
				line1 += a.charAt(i) + (i<len-1?'   ':'');
				space += (i<len-1?'\\ ':'')
			} else {
				line2 += a.charAt(i) + (i<len-1?'   ':'');			
				space += (i<len-1?'/ ':'')
			}
		}
	}
	clog('  line1: ' + line1 + '\n  space: ' + space + '\n  line2: ' + line2)
	return line1+'\n'+space+'\n'+line2;
}
function obfuscate_link() {
	var p = $('#proto').val(), a = $('#addr').val(), n = $('#title').val();
	var t = '';
	if (p == 'mailto:') { t = 'Send email to '+n;}
	else {t = 'Visit '+n;}
	var obf_js = obfuscate_js(p,a,t);
	clog('obfuscate_link: '+obf_js);
	var obf_js_pure = obf_js
		.replace(/([\s\S]*)document.write\('([\s\S]+)'\)/,"$1\nresult='$2'");
	clog('obf_js_pure=\n'+obf_js_pure);
	var obf_nojs = obfuscate_nojs(a);
	$('#obfuscated').html(script_wrap(obf_js,obf_nojs).html_encode());
	$('#original').html('<a href="'+p+a+'" title="'+t+'">'+a+'</a>');
	$('#obfuscated_js').html(eval(obf_js_pure));
	$('#obfuscated_nojs').html(obf_nojs);
};
function script_wrap(s, ns) {
	return '<script type="text/javascript">// <![CDATA[\n'	+ s + '\n// ]]></script>\n'
	+'<noscript>\n' + '<pre>' + ns +'</pre>' + '\n</noscript>';
}

$(document).ready(function() {
	$('#obfuscate').click(function(){
		clog("Obfuscate link: Name:  "+$('#title').val()
		+" protocol:  "+$('#proto').val()+" address:  "+$('#addr').val());
		obfuscate_link();
	});

	// Initialize
	if ($('#proto').val() == '')
		$('#proto').val($('#proto_ex').text());
	if ($('#addr').val() == '')
		$('#addr').val($('#addr_ex').text());
	if ($('#title').val() == '')
		$('#title').val($('#title_ex').text());
	
	$('#obfuscate').click();
	
	/* Sanity check */
    /*
	for (ct=0; ct < 0; ++ct) {
		('\n\nCount='+ct+'\n\n');
		$('#obfuscate').click();		
		if ($('#obfuscated_js').html() != $('#original').html()) {
			alert('Failed: \norig='+$('#original').html()+'\nobf='+$('#obfuscated_js').html());
			break;
		}
	}
    for (ct=0; ct < 94; ++ct) {
        s = String.fromCharCode(ct); 
        for(k=0; k < 94; ++k) {
            s2 = unescape(escape(rot_printable(s,k))).replace(/[\x21-\x7e]/g,function(c){return String.fromCharCode((c=c.charCodeAt(0)-k+94)<127?c:c-94);});
            if (s2 != s) { 
                clog('s='+s+': if k='+k+' then s1='+rot_printable(s,k)+' s2="'+s2+'"');
                clog()
            } 
        }
    }
	*/
});
global raw /scratch/public/massenkoff/sipp/nber // maxim 
cd $raw 
/*
Need to have folders $raw/{84 85 87 88 89 90 91 92 93 01 04}

Explanation of the locals:
fname gives the NBER's name of the dofile and dct file 
zname gives their name for the Core or RT zipfile
	sometimes the fname and zname change across waves, so there are "alt" names (eg fname84alt) 
	and indicators for whether to use the alt name or not (eg alt84_w1)
*/ 

local waves84 1 2 3 4 5 6 7 8 9
local waves85 1 2 3 4 5 6 7 8
local waves86 1 2 3 4 5 6 7
local waves87 1 2 3 4 5 6 7
local waves88 1 2 3 4 5 6
local waves89 1 2 3
local waves90 1 2 3 4 5 6 7 8
local waves91 1 2 3 4 5 6 7 8
local waves92 1 2 3 4 5 6 7 8 9
local waves93 1 2 3 4 5 6 7 8 9
local waves96 1 2 3 4 5 6 7 8 9 10 11 12 
local waves01 1 2 3 4 5 6 7 8 9
local waves04 1 2 3 4 5 6 7 8 9 10 11 12
local waves08 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16

local alt84_w1 1
local alt84_w2 1
local alt84_w6 1
local alt84_w9 1 
local fname84    sip84rt
local zname84    sipp84_t
local fname84alt sip84w
local zname84alt sipp84_w

local alt85_w1 1
local alt85_w2 1
local alt85_w5 1
local alt85_w6 1
local alt2_85_w8 1
local fname85     sip85rt
local zname85     sipp85_t
local fname85alt  sip85w
local zname85alt  sipp85_r
local fname85alt2 sip85w
local zname85alt2 sipp85_t

local alt86_w1 1
local fname86    sip86rt
local fname86alt sip86w
local zname86    sipp86_t
local zname86alt sipp86_w


local alt87_w1 1 
local fname87    sip87rt
local zname87    sipp87_t
local fname87alt sip87w
local zname87alt sipp87_r

local alt88_w1 1 
local fname88    sip88rt
local zname88    sipp88_t
local fname88alt sip88w
local zname88alt sipp88_r

local alt89_w3 1 // Indicates to use alt names in wave 3 of year 89
local fname89    sip89w
local zname89    sipp89_w
local zname89alt sipp89_t
local fname89alt sip89rt 

local fname90 sip90w
local zname90 sipp90w

local fname91 sip91w
local zname91 sipp91w

local fname92 sip92w
local zname92 sipp92w

local fname93 sip93w
local zname93 sipp93w

local fname96 sip96l
local zname96 sipp96l

local fname04 sippl04puw
local zname04 l04puw

local fname01 sip01w
local zname01 l01puw

local fname08 sippl08puw
local zname08 l08puw

foreach year in 08 04 01 96 92 93 91 90 89 88 87 86 85 84 {
	if substr("`year'",1,1)=="0" {
		local full`year' = "20" + "`year'"
	}
	else {
		local full`year' = "19" + "`year'"
	}
}

*******************************************************************
forvalues stage=1/2 {
	* Begin pull:
	foreach year in 84 85 86 87 88 89 90 96 91 92 93 01 04 08 {
		cd "$raw/`year'/"
		foreach wave in `waves`year'' {
			local fname `fname`year''`wave'
			local zname `zname`year''`wave'
			if 0`alt`year'_w`wave''==1 { // trick to have empty local. (because 01==1 is true)
				di "Using alternate name"
				local fname `fname`year'alt'`wave'
				local zname `zname`year'alt'`wave'	
			}
			if 0`alt2_`year'_w`wave''==1 { 
				di "Using alternate name"
				local fname `fname`year'alt2'`wave'
				local zname `zname`year'alt2'`wave'
			}
			di "Stage `stage' Year `year' wave `wave' filename: `fname' zipname: `zname'"

			if `stage'==1 {
				* check if the DAT file exists:
				capture confirm file `zname'.dat
				if _rc!=0 {
					di "Missing dat; in download loop"
					copy http://www.nber.org/sipp/`full`year''/`fname'.do ., replace 
					copy http://www.nber.org/sipp/`full`year''/`fname'.dct ., replace 
					copy http://www.nber.org/sipp/`full`year''/`zname'.zip ., replace 
					unzipfile `zname'.zip
				}
			} 
			if `stage'==2 {
				* check if the DTA file exists:
				capture confirm file `zname'.dta 
				if _rc!=0 {
					* preliminaries so that dofile doesn't throw error
					cap log close 
					label drop _all 

					* Implement fixed to the dct and do files
					* syntax: filefilter filename newfilename (<-- mandatory), from(replace this) to(with this)
					filefilter `fname'.dct `fname'_v2.dct, from("dictionary using") to("dictionary using `zname'.dat { \n *dictionary using") replace 
					
					filefilter `fname'.do `fname'_v2.do, from("infile using `fname'") to("infile using `fname'_v2") replace 

					* This changes the local declaration in the dofile so that the names of the dat, dct, and dta can be passed as the 
					* 1st,2nd,3rd arguments in the line starting "qui do `fname'_v5.do"
					filefilter `fname'_v2.do `fname'_v3.do, from("local dat_name") to("local dat_name \LQ1\RQ \n *local dat_name") replace 
					filefilter `fname'_v3.do `fname'_v4.do, from("local dct_name") to("local dct_name \LQ2\RQ \n *local dct_name") replace 
					filefilter `fname'_v4.do `fname'_v5.do, from("local dta_name") to("local dta_name \LQ3\RQ \n *local dta_name") replace 
					
					erase `fname'_v2.do 
					erase `fname'_v3.do 
					erase `fname'_v4.do

					qui do `fname'_v5.do `zname'.dat `fname'_v2.dct `zname'.dta
					save `zname'.dta, replace // because some NBER dofiles lack the save line 
					display "Wave `wave' done"
				}
			}
		}
	}
}



*end 
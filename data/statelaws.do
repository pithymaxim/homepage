import excel using "US_Unemployment_laws", sheet("Sheet1") firstrow cellrange(A1:J5762) clear
rename *,lower

rename minimumweeklybenefitamount min_wba
rename maximumweeklybenefitamount max_wba
rename minimumduration min_duration
rename maximumduration max_duration

foreach var of varlist min_wba max_wba min_duration	max_duration {
	gen orig_`var' = `var'
}

* Fix individual rows
replace max_wba = "523" if max_wba=="$523 prior to 4/1/12 $560 eff 4/1/12"
replace max_wba = "496" if strpos(max_wba,"Greater of")>0 | strpos(max_wba,"Lesser of")>0
replace max_wba = "538" if strpos(max_wba,"based on")>0 & strpos(max_wba,"538")>0
replace max_wba = "521" if strpos(max_wba,"based on")>0 & strpos(max_wba,"521")>0
replace max_wba	= "640" if strpos(max_wba," eff. 10/25/")>0
replace max_wba = "478" if max_wba=="$467 $478 (effec- tive 8/3/03)"
replace max_wba = "323" if max_wba=="$306 $323 (effective 10/5/ 03)"
replace min_duration="22" if min_duration=="21+22"
replace min_wba = "90" if min_wba=="$25-65 $50-90 Eff. 3/4/12"

* Remove the phrase "uniform duration"
replace min_duration = subinstr(lower(min_duration),"uniform duration","",.)
replace max_duration = subinstr(lower(max_duration),"uniform duration","",.)

foreach var of varlist min_wba max_wba min_duration	max_duration {
		replace `var' = lower(`var')
		replace `var' = subinstr(`var',"12½","12.5",.)
		replace `var' = subinstr(`var',"+-","-",.)
		replace `var' = subinstr(`var',"+","",.)
		replace `var' = subinstr(`var',"*","",.)
		replace `var' = subinstr(`var',"/","-",.)
		replace `var' = subinstr(`var',"$","",.)
		replace `var' = subinstr(`var',"or","-",.)
		replace `var' = subinstr(`var',",","-",.)
		replace `var' = substr(`var', 1, strpos(`var', "(") - 1) if strpos(`var', "(") > 0
		* Remove strings giving effective dates
		replace `var' = substr(`var', 1, strpos(`var', "eff") - 1) if strpos(`var', "eff") > 0
		replace `var' = subinstr(`var'," ","",.)
		replace `var' = subinstr(`var',"upto","",.)
		replace `var' = subinstr(`var',"da","",.) // DA is short for dependents allowance
		replace `var' = trim(`var')
		split `var', parse("-") gen(split_`var')
		destring split_`var'*, replace 
}

* Keep the highest value for each period
foreach	var of varlist  min_wba max_wba min_duration max_duration {
	egen tmp_`var' = rmax(split_`var'*)
	sum tmp_`var'
	drop split_`var'* `var'
	rename tmp_`var' `var'
}

sum min_wba max_wba min_duration max_duration 

* check missing
sort year state monthjanorjuly
foreach	var of varlist  min_wba max_wba min_duration max_duration {	
	display "Missing `var'"
	count if missing(`var')
	list year state monthjanorjuly orig_`var' if missing(`var')
}

drop orig_*

destring year, replace

replace monthjanorjuly = "July" if monthjanorjuly=="Jul"

* Check coverage:
tab year if stateabbreviation!="VI"

label data "UI state laws. Made by `c(username)' in import_state_laws.do ${S_DATE}"
saveold statelaws.dta, replace 


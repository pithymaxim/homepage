import excel using "US_Unemployment_laws.xlsx", sheet("Sheet1") firstrow cellrange(A1:H5126) clear
rename *,lower

rename minimumweeklybenefitamount min_wba
rename maximumweeklybenefitamount max_wba
rename minimumduration min_duration
rename maximumduration max_duration

* fix individual rows
replace max_wba = "523" if max_wba=="$523 prior to 4/1/12 $560 eff 4/1/12"
replace max_wba = "496" if strpos(max_wba,"Greater of")>0 | strpos(max_wba,"Lesser of")>0
replace max_wba = "538" if strpos(max_wba,"based on")>0 & strpos(max_wba,"538")>0
replace max_wba = "521" if strpos(max_wba,"based on")>0 & strpos(max_wba,"521")>0
replace max_wba	= "640" if strpos(max_wba," eff. 10/25/")>0
replace max_wba = "478" if max_wba=="$467 $478 (effec- tive 8/3/03)"
replace max_wba = "323" if max_wba=="$306 $323 (effective 10/5/ 03)"
replace min_duration="22" if min_duration=="21+22"
replace min_wba = "90" if min_wba=="$25-65 $50-90 Eff. 3/4/12"

foreach var of varlist min_wba max_wba min_duration	max_duration {
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
		replace `var' = substr(`var', 1, strpos(`var', "Eff") - 1) if strpos(`var', "Eff") > 0
		replace `var' = subinstr(`var'," ","",.)
		replace `var' = subinstr(`var',"Upto","",.)
		replace `var' = trim(`var')
		split `var', parse("-") gen(split_`var')
		destring split_`var'*, replace 
}

* For viewing the rows that need fixing:
* gen notnumeric=.
* foreach var of varlist split_* {
* 	replace notnumeric = real(`var')==.
* 	list `var' if notnumeric==1	& `var'!=""
* }

*keep the highest value for each period
foreach	var of varlist  min_wba max_wba min_duration max_duration {
	egen tmp_`var' = rmax(split_`var'*)
	sum tmp_`var'
	drop `var' split_`var'*
	rename tmp_`var' `var'
}

saveold statelaws.dta, replace 

*end 



const getAllCountries = [
    {
        alpha_2_code: "GB",
        en_short_name: "UK",
        nationality: "British"
    },
    {
        alpha_2_code: "NL",
        en_short_name: "Dutch",
        nationality: "Netherlandic"
    },
    {
        alpha_2_code: "AE",
        en_short_name: "UAE",
        nationality: "Emirian"
    },
    {
        alpha_2_code: "KR",
        en_short_name: "Korea",
        nationality: "Korean"
    },
    {
        alpha_2_code: "US",
        en_short_name: "USA",
        nationality: "United States"
    }
]

export function getFlagCode(flags, value){


    const countryFlagList = flags.filter(flag =>
        flag.en_short_name.toLowerCase() === value.toLowerCase()
        ||
        flag.nationality.toLowerCase() === value.toLowerCase()
    );


    if (countryFlagList.length === 1) 
        return countryFlagList[0].alpha_2_code;


    const countryFlag = getAllCountries.filter(flag =>
        flag.en_short_name.toLowerCase() === value.toLowerCase()
        ||
        flag.nationality.toLowerCase() === value.toLowerCase()
    );
    //  console.log('rrr', countryFlag);
    return countryFlag.length === 1 ? countryFlag[0].alpha_2_code: value;
    


   //  return country ? country.alpha_2_code : '';
}





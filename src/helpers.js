export function getFlagCode(flags, value){
    const country = flags.find(
        (country) => country.nationality === value || country.en_short_name === value
    );
    return country ? country.alpha_2_code : '';
}
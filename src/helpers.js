export function getFlagCode(flags, value){
    const country = flags.find(
        (country) => country.nationality === value
    );
    return country ? country.alpha_2_code : '';
}
export const getTonNotPrice = async (): Promise<any> => {
    try {
        const response = await fetch(
            "https://api.geckoterminal.com/api/v2/networks/ton/tokens/multi/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data: any = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};
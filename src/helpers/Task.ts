export default {

    async sleep(interval: number): Promise<void> {
        return new Promise(res => setTimeout(res, interval))
    }

}
import mdns from 'mdns';

const browser = mdns.createBrowser(mdns.tcp('googlecast'));


export interface IGoogleCast {
    id: string;
    name: string;
    room: string;
    address: string;
    ip: string;
}

export function getGoogleCast(): Promise<IGoogleCast> {
    return new Promise((resolve, error) => {
        browser.on('serviceUp', (service) => {
            const device = {
                id : service.txtRecord.id,
                exampleDisplayName : service.txtRecord.fn,
                exampleUniqueId : service.txtRecord.id,
                name : service.name,
                room : service.txtRecord.fn,
                address: service.addresses[0],
                ip: service.addresses[1],
            };

            if(device.ip === '192.168.0.75') {
                resolve(device)
            }
            browser.stop();
        });

        browser.start();
    });
}
import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserService } from 'src/user/user.service';
import * as WebSocket from 'ws';
import * as fs from 'fs-extra';
import * as path from 'path';

export class UserClient {
  character: string;
  username: string;
  server: string;
  clienton: boolean;
  serveron: boolean;
  map: number;
  constructor(username: string, character: string, map: number, ipsv: string) {
    this.username = username;
    this.character = character;
    this.map = map;
    this.server = ipsv;
    this.clienton = true;
  }
}

export class Connection {
  ipconnect: string;
  connect: WebSocket;
  type: number;
  status: boolean;
  mapcur: number;
  Account: UserClient;
  DomainOwner: string;
  constructor(
    ipconnect: string,
    connect: WebSocket,
    type: number,
    status: boolean,
  ) {
    this.ipconnect = ipconnect;
    this.connect = connect;
    this.type = type;
    this.status = status;
    this.mapcur = 0;
  }

  InsertAccount(user: UserClient) {
    this.Account = user;
  }
}

const typeAcction = {
  webpage: (
    connections: Connection[],
    ws: WebSocket,
    map: number,
    IPCur: string,
  ) => {
    let userconnect: Connection = new Connection(IPCur, ws, 2, true);
    connections.push(userconnect);
    console.log(`Web Connected: IP: ${IPCur} `);
  },
  DSServer: (
    connections: Connection[],
    ws: WebSocket,
    map: number,
    IPCur: string,
  ) => {
    let userconnect: Connection = new Connection(IPCur, ws, 3, true);
    connections.push(userconnect);
    console.log(`DSServer Connected: IP: ${IPCur} `);
  },
  NDServer: (
    connections: Connection[],
    ws: WebSocket,
    map: number,
    IPCur: string,
  ) => {
    let userconnect: Connection = new Connection(IPCur, ws, 4, true);
    userconnect.mapcur = map;
    connections.push(userconnect);
    console.log(`NDServer Connected: IP: ${IPCur} `);
  },
};
@WebSocketGateway(8888)
export class EventsGateway implements OnModuleInit {
  constructor(private userService: UserService) {}
  @WebSocketServer()
  server: WebSocket.Server;
  connections: Connection[] = [];

  private Record_Desktop(page: WebSocket, userid: string, status: string) {
    let isFound = false;
    const getWebPage = this.connections.find((ob) => ob.connect == page);
    if (getWebPage) {
      this.connections.forEach((connect) => {
        if (connect.Account != null) {
          if (
            connect.Account.server == getWebPage.DomainOwner &&
            connect.Account.username == userid
          ) {
            let RecordStatus = status == 'true' ? 1 : 0;

            if (RecordStatus) {
              const EventSend = {
                event: 'MSG_RECORD',
                data: {
                  delay: 100,
                  status: 1,
                },
              };
              console.log(EventSend);
              connect.connect.send(JSON.stringify(EventSend));
            } else {
              const EventSend = {
                event: 'MSG_RECORD',
                data: {
                  delay: 100,
                  status: 0,
                },
              };
              console.log(EventSend);
              connect.connect.send(JSON.stringify(EventSend));
            }

            isFound = true;
            console.log(
              status == 'true' ? 'Record Desktop Start' : 'Record Desktop Stop',
            );
          }
        }
      });
    } else {
      console.log('Webpage not found');
    }
  }

  private Record_DesktoptoWeb(iwsconnect: WebSocket, mage: string) {
    const getUser = this.connections.find(
      (connect) => connect.connect == iwsconnect,
    );
    let isSend = false;
    console.log(getUser?.Account.server);
    this.connections.forEach((connect) => {
      console.log(connect.DomainOwner, connect.type);
      if (connect.type == 2 && connect.DomainOwner == getUser?.Account.server) {
        const EventSend = {
          event: 'RMSG_RECORD',
          data: mage,
        };
        connect.connect.send(JSON.stringify(EventSend));
        isSend = true;
      }
    });
    if (isSend) {
      console.log('Record Desktop Send to Webpage Complete');
    }
  }

  async createFileWithContent(
    namecomputer: string,
    nameServer: string,
    content: string,
  ): Promise<void> {
    const Time = new Date();
    console.log('Creating file...');
    const now = new Date();
    const formattedDate = [
      String(now.getSeconds()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getHours()).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
      String(now.getMonth() + 1).padStart(2, '0'), // Tháng tính từ 0 nên cần cộng thêm 1
      now.getFullYear(),
    ].join('');
    try {
      const currentpath = process.cwd();
      const pathFolder = path.join(
        currentpath,
        'public',
        nameServer,
        namecomputer,
        now.getFullYear().toString(),
        (now.getMonth() + 1).toString(),
      );
      const fileName = `${formattedDate}.jpg`;
      const filePath = path.join(pathFolder, fileName);

      // Đảm bảo rằng thư mục cha tồn tại
      await fs.ensureDir(pathFolder);

      const bufferContent = Buffer.from(content, 'base64');
      await fs.promises.writeFile(filePath, bufferContent);

      console.log(`File ${formattedDate} created successfully.`);
    } catch (error) {
      console.error(`Error creating file ${formattedDate}: ${error}`);
      throw error;
    }
  }

  private UpdateClientInfo(
    wsconnect: WebSocket,
    iduser: string,
    chracname: string,
    map: number,
    IpSv: string,
  ) {
    this.connections.forEach((connect) => {
      if (connect.connect == wsconnect) {
        connect.type = 1;
        let AccountUser: UserClient = new UserClient(
          iduser,
          chracname,
          map,
          IpSv,
        );
        connect.Account = AccountUser;
        console.log('Update Information Client Complete');
      }
    });
  }

  async UpdateWebInfo(wsconnect: WebSocket, data: any) {
    try {
      console.log(data);
      if (data?.userid == null) {
        return;
      }
      for (const connect of this.connections) {
        if (connect.connect == wsconnect) {
          const getDomain = await this.userService.getServerDomain(
            data?.userid,
          );
          if (getDomain) {
            connect.DomainOwner = getDomain;
            connect.type = 2;
            console.log(data?.userid, getDomain);
          }
          console.log('Update Information Web Complete');
          break;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  private ListUserIN(page: WebSocket) {
    const getWebPage = this.connections.find((ob) => ob.connect == page);
    let Users: UserClient[] = [];
    this.connections.forEach((connect) => {
      if (connect.Account != null) {
        console.log(
          connect.Account.server,
          connect.Account?.username,
          getWebPage.DomainOwner,
        );
        if (connect.Account.server == getWebPage.DomainOwner) {
          let getUser = new UserClient(
            connect.Account.username,
            connect.Account.character,
            connect.Account.map,
            connect.Account.server,
          );
          Users.push(getUser);
        }
      }
    });
    const EventSend = {
      event: 'SMSG_LISTUSER',
      data: Users,
    };
    page.send(JSON.stringify(EventSend));
  }

  //Get Package from Webpage
  @SubscribeMessage('events')
  handleEvent(wsconnect: WebSocket, data: any): void | any {
    // Request Capture Image;
    /**
     * MSG_RECORD :  Record Desktop
     * MSG_INVENTORY : RQ Inventory
     * MSG_DETAILS : RQ InforUser
     * MSG_COMPUTER : RQ InforComputer
     * MSG_POSITION : RQ Current Position
     * MSG_CAPTURE : RQ Capture Image
     * MSG_UPDATEINFORMATION : UPDATE INFORMATION CLIENT
     */
    switch (data?.msg) {
      case 'MSG_RECORD':
        this.Record_Desktop(wsconnect, data?.userid, data?.status);
        break;
      case 'MSG_LISTUSER':
        this.ListUserIN(wsconnect);
        break;
      case 'MSG_UPDATEINFORWEBPAGE':
        this.UpdateWebInfo(wsconnect, data);
        break;
    }
  }

  //Get Package from Client
  @SubscribeMessage('recevei_package')
  getEvent(wsconnect: WebSocket, data: any): void | any {
    switch (data?.msg) {
      case 'RMSG_RECORD':
        this.Record_DesktoptoWeb(wsconnect, data.img);
        break;
      case 'RMSG_TAKESCREENSHOT':
        this.createFileWithContent(
          data?.nameComputer,
          data?.nameServer,
          data.img,
        );
        break;
      case 'MSG_INVENTORY':
        break;
      case 'MSG_UPDATEINFORCLIENT':
        this.UpdateClientInfo(
          wsconnect,
          data?.idUser,
          data?.charactername,
          data?.CurMap,
          data?.IpServer,
        );
        break;
    }
  }

  onModuleInit() {
    const self = this;
    this.server.on('connection', function connection(ws, req) {
      if (typeAcction[req.headers.type]) {
        typeAcction[req.headers.type](
          self.connections,
          ws,
          req.headers?.map,
          req.connection.remoteAddress,
        );
      } else {
        let userconnect: Connection = new Connection(
          req.connection.remoteAddress,
          ws,
          1,
          true,
        );
        self.connections.push(userconnect);
        console.log(`Client Connected: IP: ${req.connection.remoteAddress} `);
      }
      ws.on('close', () => {
        const index = self.connections.findIndex(
          (connection) => connection.connect == ws,
        );
        if (index != -1) {
          console.log(
            `Disconnected: IP: ${self.connections[index].ipconnect} `,
          );
          self.connections.splice(index, 1);
        }
      });
    });
  }
}

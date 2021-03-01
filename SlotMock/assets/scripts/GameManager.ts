const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  @property(cc.Node)
  machine = null;

  @property({ type: cc.AudioClip })
  audioClick = null;

  @property({ type: [cc.Node], visible: true })
  private glow = [];

  private block = false;

  private result = null;

  private line1 = false;
  private line2 = false;
  private line3 = false;

  start(): void {
    this.machine.getComponent('Machine').createMachine();
    this.disableGlow();
  }

  update(): void {
    if (this.block && this.result != null) {
      this.informStop();
      this.result = null;
    }
    //Valida se os reels terminaram de girar
    if(this.machine.getComponent('Machine').stopReels === true){
      cc.log("enable");
      if(this.line1){
        this.enableGlowLine1();
      }
      if(this.line2){
        this.enableGlowLine2();
      }
      if(this.line3){
        this.enableGlowLine3();
      }
      this.machine.getComponent('Machine').stopReels = false;
    }
  }

  click(): void {
    cc.audioEngine.playEffect(this.audioClick, false);
    if (this.machine.getComponent('Machine').spinning === false) {
      this.block = false;
      this.machine.getComponent('Machine').spin();
      this.disableGlow();
      this.requestResult();
    } else if (!this.block) {
      this.block = true;
      this.machine.getComponent('Machine').lock();
    }
  }

  async requestResult(): Promise<void> {
    this.result = null;
    this.result = await this.getAnswer();
  }

  getAnswer(): Promise<Array<Array<number>>> {
    // Cria o resultado do slot
    const slotResult = [
      [null, null, null], 
      [null, null, null], 
      [null, null, null], 
      [null, null, null], 
      [null, null, null]
    ];

    //Gera o tipo de resultado
    // 50% random
    // 33% 1 linha
    // 10% 2 linhas
    // 7% 3 linhas
    let chance = Math.random() * 100;
    this.line1 = false;
    this.line2 = false;
    this.line3 = false;
    if(chance < 51){
      cc.log("Random - 50%");
    }
    else if(chance >= 51 && chance < 84){
      cc.log("One line - 33%");
      const selectLine = Math.random() * 100;
      //Seleciona linhas que serão preenchidas
      if(selectLine < 34){
        this.line1 = true;
      } else if(selectLine >= 34 && selectLine < 67){
        this.line2 = true;
      } else if(selectLine >= 67){
        this.line3 = true;
      }
    }
    else if(chance >= 84 && chance < 94){
      cc.log("Two lines - 10%");
      const selectLine = Math.random() * 100;
      //Seleciona linhas que serão preenchidas
      if(selectLine < 34){
        this.line1 = true;
        this.line2 = true;
      } else if(selectLine >= 34 && selectLine < 67){
        this.line2 = true;
        this.line3 = true;
      } else if(selectLine >= 67){
        this.line3 = true;
        this.line1 = true;
      }
    }
    else if(chance >= 94){
      cc.log("Three lines - 7%");
      this.line1 = true;
      this.line2 = true;
      this.line3 = true;
    }

    //Seleciona um tile para preencher a linha e preenche a linha
    if(this.line1){
      var winningTile = Math.floor(Math.random() * 30);
      slotResult[0][0] = winningTile;
      slotResult[1][0] = winningTile;
      slotResult[2][0] = winningTile;
      slotResult[3][0] = winningTile;
      slotResult[4][0] = winningTile;
    }
    if(this.line2){
      var winningTile = Math.floor(Math.random() * 30);
      slotResult[0][1] = winningTile;
      slotResult[1][1] = winningTile;
      slotResult[2][1] = winningTile;
      slotResult[3][1] = winningTile;
      slotResult[4][1] = winningTile;
    }
    if(this.line3){
      var winningTile = Math.floor(Math.random() * 30);
      slotResult[0][2] = winningTile;
      slotResult[1][2] = winningTile;
      slotResult[2][2] = winningTile;
      slotResult[3][2] = winningTile;
      slotResult[4][2] = winningTile;
    }
    return new Promise<Array<Array<number>>>(resolve => {
      setTimeout(() => {
        resolve(slotResult);
      }, 1000 + 500 * Math.random());
    });
  }

  informStop(): void {
    const resultRelayed = this.result;
    this.machine.getComponent('Machine').stop(resultRelayed);
  }
  //Desabilita o efeito
  disableGlow(): void{
    cc.log("disable glow");
    this.glow.forEach(item => {
      item.active = false;
    });
  }
  //Desabilita o efeito na linha 1
  enableGlowLine1(): void{
    cc.log("enable glow");
    for(let i=0; i<this.glow.length; i = i+3){
      this.glow[i].active = true;
    }
  }
  //Desabilita o efeito na linha 2
  enableGlowLine2(): void{
    cc.log("enable glow");
    for(let i=1; i<this.glow.length; i = i+3){
      this.glow[i].active = true;
    }
  }
  //Desabilita o efeito na linha 3
  enableGlowLine3(): void{
    cc.log("enable glow");
    for(let i=2; i<this.glow.length; i = i+3){
      this.glow[i].active = true;
    }
  }
}

import {
  Hey
} from '..';

class com extends Componet {
  render() {
    return (
      <Header
        left={
          <View>
            <HeaderIcon name='back' />
            <WebView
              key={index}
              style={{ 
                flex: 1
              }}
              source={{ 
                html: item.text 
              }}
            />
          </View>
        }
        style={{

        }}
        onChange={
          
        }
      >
      </Header>
    )
  }
}

export default com;
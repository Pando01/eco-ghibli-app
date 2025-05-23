import React, { useState } from 'react';
import { Cloud, Leaf, Send, Image, TreePine, Info, Camera, MapPin, Award, Users, BarChart } from 'lucide-react';

const EcoGhibliApp = () => {
  const [generatedImage, setGeneratedImage] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  
  // Pollinations.ai를 사용한 이미지 생성 함수
  const generateGhibliImage = async (prompt) => {
    try {
      // Studio Ghibli 스타일 프롬프트 생성
      const ghibliPrompt = `Studio Ghibli style, ${prompt}, anime, beautiful, detailed, warm colors, Miyazaki style, high quality`;
      const encodedPrompt = encodeURIComponent(ghibliPrompt);
      
      // Pollinations.ai API 사용
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${Date.now()}&model=flux`;
      
      return imageUrl;
    } catch (error) {
      console.error("이미지 생성 오류:", error);
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!userPrompt.trim()) {
      alert("프롬프트를 입력해주세요!");
      return;
    }
    
    setIsGenerating(true);
    setGeneratedImage(false);
    setShowImpact(false);
    
    try {
      const imageUrl = await generateGhibliImage(userPrompt);
      
      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
        setGeneratedImage(true);
        // 이미지 로딩 시간을 고려해서 환경 영향 표시
        setTimeout(() => setShowImpact(true), 3000);
      }
    } catch (error) {
      console.error("생성 오류:", error);
      alert("이미지 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetApp = () => {
    setGeneratedImage(false);
    setShowImpact(false);
    setCurrentTab('home');
    setGeneratedImageUrl('');
    setUserPrompt('');
    setIsGenerating(false);
  };

  const renderHomeScreen = () => (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="w-full flex items-center justify-between p-4 bg-green-600 text-white">
        <div className="flex items-center">
          <Leaf className="w-6 h-6 mr-2" />
          <h1 className="text-xl font-bold">에코 지브리</h1>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center bg-green-500 px-3 py-1 rounded-full">
            <Leaf className="w-4 h-4 mr-1" />
            <span className="text-sm font-semibold">128점</span>
          </div>
          <button className="bg-green-700 p-2 rounded-full">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="flex-1 p-4 bg-green-50">
        {!generatedImage ? (
          <div className="w-full h-64 bg-gray-200 rounded-lg flex flex-col items-center justify-center">
            <Image className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-600 mb-4 text-center">지브리 스타일의 이미지를 생성해보세요</p>
            <input 
              className="w-4/5 p-2 border border-gray-300 rounded-lg mb-2 text-sm"
              placeholder="예: 숲속에 있는 작은 집과 토토로"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              disabled={isGenerating}
              onKeyPress={(e) => e.key === 'Enter' && !isGenerating && handleGenerate()}
            />
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !userPrompt.trim()}
              className={`px-4 py-2 rounded-lg flex items-center ${
                isGenerating || !userPrompt.trim()
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white transition-colors`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  생성 중...
                </>
              ) : (
                <>
                  이미지 생성하기 <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        ) : (
          <>
            <div className="w-full h-64 bg-green-100 rounded-lg flex items-center justify-center overflow-hidden mb-4">
              {generatedImageUrl ? (
                <img 
                  src={generatedImageUrl} 
                  alt="생성된 지브리 스타일 이미지"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    console.log("이미지 로딩 실패");
                    // 이미지 로딩 실패 시 기본 이미지로 변경
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                  onLoad={() => {
                    console.log("이미지 로딩 완료!");
                  }}
                />
              ) : null}
              <div className="w-full h-full bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center" style={{display: generatedImageUrl ? 'none' : 'flex'}}>
                <div className="text-center">
                  <div className="text-6xl mb-2">🏠</div>
                  <div className="text-2xl">🌲</div>
                  <p className="text-sm text-green-800 mt-2">지브리 스타일 완성!</p>
                </div>
              </div>
            </div>
            
            {showImpact && (
              <div className="w-full bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-green-800 mb-2">환경 영향</h2>
                
                <div className="flex justify-between mb-3">
                  <div className="flex items-center">
                    <Cloud className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-gray-700">이산화탄소 발생량</span>
                  </div>
                  <span className="font-bold text-red-500">23g CO₂e</span>
                </div>
                
                <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                
                <div className="bg-green-100 p-3 rounded-lg mb-4">
                  <p className="text-green-800 text-sm">
                    이 이미지 생성으로 인한 환경 영향을 상쇄하려면:
                  </p>
                  <ul className="mt-2">
                    <li className="flex items-center text-sm mb-1">
                      <TreePine className="w-4 h-4 text-green-600 mr-2" />
                      <span>5분 동안 디지털 디톡스</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Leaf className="w-4 h-4 text-green-600 mr-2" />
                      <span>재활용 쓰레기 분리수거 3개 실천하기</span>
                    </li>
                  </ul>
                </div>
                
                <button 
                  onClick={() => setCurrentTab('activity')}
                  className="w-full bg-green-600 text-white py-2 rounded-lg mb-2"
                >
                  실천하고 에코 포인트 받기
                </button>
                
                <button 
                  onClick={resetApp}
                  className="w-full bg-gray-500 text-white py-2 rounded-lg"
                >
                  새 이미지 생성하기
                </button>
              </div>
            )}
          </>
        )}
        
        {/* 주간 챌린지 */}
        <div className="w-full mt-4">
          <h3 className="text-md font-semibold text-green-800 mb-2">주간 환경 챌린지</h3>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-green-200 p-2 rounded-full mr-2">
                  <Leaf className="w-5 h-5 text-green-700" />
                </div>
                <span className="text-sm">일주일간 텀블러 사용하기</span>
              </div>
              <span className="text-xs bg-green-100 px-2 py-1 rounded-full text-green-800">3/7일</span>
            </div>
            <div className="w-full bg-green-200 h-2 rounded-full mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '43%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityScreen = () => (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="w-full flex items-center justify-between p-4 bg-green-600 text-white">
        <button onClick={() => setCurrentTab('home')} className="text-white">
          ← 돌아가기
        </button>
        <h1 className="text-xl font-bold">환경 활동 인증</h1>
        <div className="flex items-center bg-green-500 px-3 py-1 rounded-full">
          <Leaf className="w-4 h-4 mr-1" />
          <span className="text-sm font-semibold">128점</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 bg-green-50">
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-bold text-green-800 mb-3">활동 체크리스트</h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-green-600 rounded mr-2" />
              <span className="text-gray-700">재활용 쓰레기 분리수거 하기</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-green-600 rounded mr-2" checked readOnly />
              <span className="text-gray-700 line-through">5분 동안 디지털 디톡스</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-green-600 rounded mr-2" />
              <span className="text-gray-700">텀블러 사용하기</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-bold text-green-800 mb-3">활동 인증</h2>
          
          <div className="flex justify-between mb-3">
            <button className="flex-1 flex flex-col items-center justify-center p-3 border border-green-300 rounded-lg mr-2">
              <Camera className="h-6 w-6 text-green-600 mb-1" />
              <span className="text-sm text-gray-700">사진 인증</span>
            </button>
            <button className="flex-1 flex flex-col items-center justify-center p-3 border border-green-300 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600 mb-1" />
              <span className="text-sm text-gray-700">위치 인증</span>
            </button>
          </div>
          
          <div className="h-40 border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Camera className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">인증 사진을 업로드하세요</p>
            </div>
          </div>
        </div>
        
        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold">
          인증 완료하기
        </button>
      </div>
    </div>
  );

  const renderProfileScreen = () => (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="w-full flex items-center justify-between p-4 bg-green-600 text-white">
        <button onClick={() => setCurrentTab('home')} className="text-white">
          ← 돌아가기
        </button>
        <h1 className="text-xl font-bold">나의 에코 프로필</h1>
        <button className="bg-green-700 p-2 rounded-full">
          <Info className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 p-4 bg-green-50">
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex items-center mb-4">
            <div className="h-16 w-16 bg-green-200 rounded-full flex items-center justify-center mr-3">
              <Leaf className="h-8 w-8 text-green-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">김에코</h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Lv.3 지구지킴이</span>
                <div className="flex items-center bg-green-100 px-2 py-0.5 rounded-full">
                  <Leaf className="w-3 h-3 text-green-700 mr-1" />
                  <span className="text-xs font-semibold text-green-800">128점</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 text-center border-t border-gray-200 pt-3">
            <div>
              <div className="text-green-700 font-bold">12</div>
              <div className="text-xs text-gray-500">생성 이미지</div>
            </div>
            <div>
              <div className="text-red-500 font-bold">2.8kg</div>
              <div className="text-xs text-gray-500">총 CO₂</div>
            </div>
            <div>
              <div className="text-green-700 font-bold">2.1kg</div>
              <div className="text-xs text-gray-500">상쇄 활동</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-bold text-green-800 mb-3">환경 활동 통계</h2>
          
          <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
            <BarChart className="h-6 w-6 text-gray-400" />
          </div>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>최근 7일</span>
            <span>월간</span>
            <span>전체</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold text-green-800 mb-3">획득한 뱃지</h2>
          
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-green-200 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-green-700" />
              </div>
              <span className="text-xs text-gray-600 mt-1">첫 실천</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-green-200 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-green-700" />
              </div>
              <span className="text-xs text-gray-600 mt-1">10일 연속</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-xs text-gray-400 mt-1">탄소 제로</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-xs text-gray-400 mt-1">친구 초대</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunityScreen = () => (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="w-full flex items-center justify-between p-4 bg-green-600 text-white">
        <button onClick={() => setCurrentTab('home')} className="text-white">
          ← 돌아가기
        </button>
        <h1 className="text-xl font-bold">커뮤니티</h1>
        <div className="flex items-center bg-green-500 px-3 py-1 rounded-full">
          <Users className="w-4 h-4 mr-1" />
          <span className="text-sm font-semibold">128명</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 bg-green-50">
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-bold text-green-800 mb-3">현재 진행 중인 챌린지</h2>
          
          <div className="bg-green-100 p-3 rounded-lg mb-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="bg-green-200 p-2 rounded-full mr-2">
                  <TreePine className="w-5 h-5 text-green-700" />
                </div>
                <span className="font-medium text-green-800">지구의 날 기념 특별 챌린지</span>
              </div>
              <span className="text-xs bg-green-600 px-2 py-1 rounded-full text-white">D-3</span>
            </div>
            <div className="w-full bg-green-200 h-2 rounded-full">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-green-700 mt-1">
              <span>현재: 65%</span>
              <span>목표: 100%</span>
            </div>
          </div>
          
          <button className="w-full bg-green-600 text-white py-2 rounded-lg mb-2">
            챌린지 참여하기
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-green-800">친환경 팁 공유</h2>
            <button className="text-sm text-green-600">더보기</button>
          </div>
          
          <div className="space-y-3">
            <div className="border-b border-gray-100 pb-3">
              <div className="flex items-center mb-1">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                  <Leaf className="h-4 w-4 text-green-700" />
                </div>
                <span className="text-sm font-medium">에코사랑</span>
                <span className="text-xs text-gray-500 ml-2">2시간 전</span>
              </div>
              <p className="text-sm text-gray-700">
                지브리풍 이미지 생성 시 낮은 해상도로 먼저 시험해보고 마음에 들면 고해상도로 한 번만 생성하는 게 좋아요!
              </p>
            </div>
            
            <div className="border-b border-gray-100 pb-3">
              <div className="flex items-center mb-1">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                  <Leaf className="h-4 w-4 text-green-700" />
                </div>
                <span className="text-sm font-medium">탄소제로</span>
                <span className="text-xs text-gray-500 ml-2">어제</span>
              </div>
              <p className="text-sm text-gray-700">
                프롬프트 작성법: "지브리풍, 자연, 시골집"보다는 "지브리스타일의 시골 풍경과 작은 집, 따뜻한 햇살"처럼 구체적으로!
              </p>
            </div>
          </div>
          
          <button className="w-full mt-3 border border-green-600 text-green-600 py-2 rounded-lg">
            팁 작성하기
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center h-full bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl relative">
        {/* 메인 콘텐츠 */}
        <div className="h-screen overflow-hidden">
          {currentTab === 'home' && renderHomeScreen()}
          {currentTab === 'activity' && renderActivityScreen()}
          {currentTab === 'profile' && renderProfileScreen()}
          {currentTab === 'community' && renderCommunityScreen()}
        </div>

        {/* 하단 네비게이션 */}
        {currentTab === 'home' && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
            <button 
              onClick={() => setCurrentTab('home')}
              className="flex-1 flex flex-col items-center py-2 text-green-600"
            >
              <Image className="w-5 h-5" />
              <span className="text-xs">홈</span>
            </button>
            <button 
              onClick={() => setCurrentTab('activity')}
              className="flex-1 flex flex-col items-center py-2 text-gray-400"
            >
              <TreePine className="w-5 h-5" />
              <span className="text-xs">활동</span>
            </button>
            <button 
              onClick={() => setCurrentTab('profile')}
              className="flex-1 flex flex-col items-center py-2 text-gray-400"
            >
              <Award className="w-5 h-5" />
              <span className="text-xs">프로필</span>
            </button>
            <button 
              onClick={() => setCurrentTab('community')}
              className="flex-1 flex flex-col items-center py-2 text-gray-400"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">커뮤니티</span>
            </button>
          </div>
        )}
      </div>

      {/* 앱 리셋 버튼 */}
      <button 
        onClick={resetApp}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
      >
        앱 초기화
      </button>
    </div>
  );
};

export default EcoGhibliApp;